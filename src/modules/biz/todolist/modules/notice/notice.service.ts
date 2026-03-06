import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { NoticeSetting } from '../../entities/noticeSetting.entity';
import { NoticeRun, NoticeTriggeredBy } from '../../entities/noticeRun.entity';
import {
  NoticeChannel,
  NoticeRecord,
  NoticeStatus,
} from '../../entities/noticeRecord.entity';
import { AdminTriggerDto, RecordsListDto, RunsListDto } from './dto/admin.dto';
import { UpdateSettingDto } from './dto/setting.dto';
import { UsersService } from 'src/modules/auth/services/user.service';
import { QQNodeMailerService } from 'src/modules/system/modules/mail/qq/qq.service';
import { LetterService } from 'src/modules/system/modules/siteLetter/letter/letter.service';
import { SendLetterService } from 'src/modules/system/modules/siteLetter/sendLetter/sendLetter.service';
import { EPlatform } from 'src/modules/system/modules/siteLetter/entities/letter.entity';
import { Task } from '../../entities/task.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
const dayjs = require('dayjs');

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeSetting)
    private readonly settingRepo: Repository<NoticeSetting>,
    @InjectRepository(NoticeRun)
    private readonly runRepo: Repository<NoticeRun>,
    @InjectRepository(NoticeRecord)
    private readonly recordRepo: Repository<NoticeRecord>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly mailService: QQNodeMailerService,
    private readonly letterService: LetterService,
    private readonly sendLetterService: SendLetterService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  protected async handleCron() {
    await this.systemScan();
  }

  async getSetting(userId: number) {
    let setting = await this.settingRepo.findOne({ where: { userId } });
    if (!setting) {
      setting = this.settingRepo.create({
        userId,
        emailEnabled: true,
        letterEnabled: false,
        preferredTime: '08:30',
      });
      await this.settingRepo.save(setting);
    }
    return {
      emailEnabled: setting.emailEnabled,
      letterEnabled: setting.letterEnabled,
      preferredTime: setting.preferredTime,
    };
  }

  async updateSetting(userId: number, dto: UpdateSettingDto) {
    let setting = await this.settingRepo.findOne({ where: { userId } });
    if (!setting) {
      setting = this.settingRepo.create({ userId });
    }
    if (dto.emailEnabled !== undefined) setting.emailEnabled = dto.emailEnabled;
    if (dto.letterEnabled !== undefined)
      setting.letterEnabled = dto.letterEnabled;
    if (dto.preferredTime !== undefined)
      setting.preferredTime = dto.preferredTime;
    await this.settingRepo.save(setting);
    return true;
  }

  async adminTrigger(adminId: number, dto: AdminTriggerDto) {
    const date = dto.date || this.formatDate(new Date()).date;
    const run = await this.createRun(NoticeTriggeredBy.ADMIN, adminId);
    const users = dto.userId
      ? [dto.userId]
      : await this.usersService.findAllId();
    let sentCount = 0;
    for (const userId of users) {
      const setting = await this.settingRepo.findOne({ where: { userId } });
      if (!setting) continue;
      const channels = this.resolveChannels(
        (dto.channel || 'both') as 'email' | 'letter' | 'both',
        setting,
      );
      const count = await this.notifyUserForDate(
        userId,
        date,
        channels,
        run.id,
        true,
      );
      sentCount += count;
    }
    await this.runRepo.update({ id: run.id }, { sentCount });
    return {
      runId: run.id,
      runAt: run.runAt,
      sentCount,
    };
  }

  async listRecords(dto: RecordsListDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const where: any = {};
    if (dto.userId) where.userId = dto.userId;
    if (dto.channel) where.channel = dto.channel;
    if (dto.status) where.status = dto.status;
    const [result, total] = await this.recordRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { sentAt: 'DESC' },
    });
    return { page, result, total };
  }

  async listRuns(dto: RunsListDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const [result, total] = await this.runRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { runAt: 'DESC' },
    });
    return { page, result, total };
  }

  private async systemScan() {
    const now = new Date();
    const { date, time } = this.formatDate(now);
    const run = await this.createRun(NoticeTriggeredBy.SYSTEM, null);
    const settings = await this.settingRepo.find({
      where: { preferredTime: time },
    });
    let sentCount = 0;
    for (const setting of settings) {
      const channels = this.resolveChannels('both', setting);
      const count = await this.notifyUserForDate(
        setting.userId,
        date,
        channels,
        run.id,
      );
      sentCount += count;
    }
    await this.runRepo.update({ id: run.id }, { sentCount });
  }

  private resolveChannels(
    preferred: 'email' | 'letter' | 'both',
    setting: NoticeSetting,
  ): NoticeChannel[] {
    const channels: NoticeChannel[] = [];
    if ((preferred === 'email' || preferred === 'both') && setting.emailEnabled)
      channels.push(NoticeChannel.EMAIL);
    if (
      (preferred === 'letter' || preferred === 'both') &&
      setting.letterEnabled
    )
      channels.push(NoticeChannel.LETTER);
    return channels;
  }

  private async createRun(
    triggeredBy: NoticeTriggeredBy,
    operatorId: number | null,
  ) {
    const run = this.runRepo.create({
      triggeredBy,
      operatorId: operatorId ?? null,
      sentCount: 0,
    });
    return await this.runRepo.save(run);
  }

  private async notifyUserForDate(
    userId: number,
    date: string,
    channels: NoticeChannel[],
    runId: number,
    skipDuplicate = false,
  ): Promise<number> {
    if (channels.length === 0) return 0;
    const { dateStart, dateEnd, dateStartStr, dateEndStr } =
      this.getDayRange(date);
    const qb = this.taskRepo
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .andWhere(
        '(task.expectTime BETWEEN :ds AND :de) OR (FROM_UNIXTIME(task.expectTime) BETWEEN :ds AND :de) OR (FROM_UNIXTIME(task.expectTime/1000) BETWEEN :ds AND :de)',
        { ds: dateStartStr, de: dateEndStr },
      );
    const tasks = await qb.getMany();
    if (tasks.length === 0) return 0;
    let sent = 0;
    const user = await this.usersService.getUserById(userId);
    const subject = `【吉米前端】今日待办事项提醒：你有 ${tasks.length} 个任务即将截止`;
    const html = this.renderMail(
      user?.nickname || '朋友',
      date,
      tasks.map((t) => ({ name: t.taskName, time: t.expectTime })),
    );
    for (const channel of channels) {
      const tasksToNotify: Task[] = [];
      if (!skipDuplicate) {
        for (const task of tasks) {
          const exists = await this.recordRepo.findOne({
            where: {
              userId,
              taskId: task.taskId,
              channel,
              sentAt: Between(dateStart, dateEnd),
            } as any,
          });
          if (!exists) tasksToNotify.push(task);
        }
      } else {
        tasksToNotify.push(...tasks);
      }
      // 当天该渠道无需要提醒的任务：不发送，仅记录日志，便于排查
      if (tasksToNotify.length === 0) {
        console.log('no tasks need notify for channel', channel);
      } else {
        console.log('sssss');
        // 执行发送：根据渠道发送邮件或站内信，并为每个任务写入发送记录
        let success = false;
        let error: string | null = null;
        if (channel === NoticeChannel.EMAIL) {
          if (user?.mail) {
            success = await this.mailService.sendHtml({
              to: user.mail,
              subject,
              html,
            });
            if (!success) error = 'send email failed';
          } else {
            error = 'no email';
          }
        } else if (channel === NoticeChannel.LETTER) {
          try {
            const letter = await this.letterService.addLetter({
              title: subject,
              content: html,
              platform: EPlatform.todoList,
            });
            await this.sendLetterService.sendToSome(letter.letterId, [userId]);
            success = true;
          } catch {
            success = false;
            error = 'send letter failed';
          }
        }
        const records: NoticeRecord[] = [];
        for (const task of tasksToNotify) {
          const rec = this.recordRepo.create({
            userId,
            taskId: task.taskId,
            runId,
            channel,
            status: success ? NoticeStatus.SUCCESS : NoticeStatus.FAILED,
            errorMessage: success ? null : error,
          });
          records.push(rec);
        }
        await this.recordRepo.save(records);
        if (success) sent += records.length;
      }
    }
    return sent;
  }

  private renderMail(
    nickname: string,
    date: string,
    tasks: { name: string; time: string }[],
  ) {
    const items = tasks
      .map(
        (t) =>
          `<li>${t.name} - 截止时间：${dayjs(Number(t.time) || t.time).format(
            'YYYY-MM-DD',
          )}</li>`,
      )
      .join('');
    return `<!DOCTYPE html><html><body><p>Hi ${nickname}，</p><p>${date} 截止的任务清单：</p><ul>${items}</ul><p>登录 吉米前端 查看更多任务细节。</p><p>吉米前端 团队</p></body></html>`;
  }

  private getDayRange(date: string) {
    const start = dayjs(date).startOf('day');
    const end = dayjs(date).endOf('day');
    return {
      dateStart: start.toDate(),
      dateEnd: end.toDate(),
      dateStartStr: start.format('YYYY-MM-DD HH:mm:ss'),
      dateEndStr: end.format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  private formatDate(d: Date) {
    const m = dayjs(d);
    const date = m.format('YYYY-MM-DD');
    const minutes = m.minute() < 30 ? '00' : '30';
    const time = `${m.format('HH')}:${minutes}`;
    return { date, time };
  }
}
