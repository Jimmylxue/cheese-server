import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AddUserTypeParams,
  DelTypeParams,
  DetailTypeParams,
  UpdateTypeParams,
} from './dto/taskType.dto';
import { TaskTypeService } from './taskType.service';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import { TaskTypeResponseDto } from './dto/taskTypeResponse.dto';
import { TaskType } from '../../entities/taskType.entity';

@ApiTags('待办事项-任务类型')
@Controller('taskType')
export class TaskTypeController {
  constructor(private readonly taskTypeService: TaskTypeService) {}

  @ApiOperation({ summary: '查看任务类型列表' })
  @ApiResponse({
    description: '任务类型列表返回',
    type: TaskTypeResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/list')
  async getUserType(@Req() auth) {
    const { user } = auth;
    const taskTypes = await this.taskTypeService.getUserTaskTypes(+user.userId);
    return {
      code: 200,
      result: taskTypes,
    };
  }

  @ApiOperation({ summary: '查看任务类型详情' })
  @ApiResponse({
    description: '任务类型详情返回',
    type: TaskType,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/detail')
  async getTypeDetail(@Body() req: DetailTypeParams, @Req() auth) {
    const { typeId } = req;
    const { user } = auth;
    const userId = user.userId;
    const taskTypes = await this.taskTypeService.getTaskTypeDetail(
      +typeId,
      userId,
    );
    if (!taskTypes) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: taskTypes,
    };
  }

  @ApiOperation({ summary: '添加任务类型' })
  @ApiResponse({
    description: '添加任务类型返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/add')
  async addUserType(@Body() req: AddUserTypeParams, @Req() auth) {
    const { typeName, desc, themeColor, icon } = req;
    const { user } = auth;
    const userId = user.userId;
    const params = {
      userId,
      typeName,
      desc,
      createTime: String(Date.now()),
      themeColor,
      icon,
    };
    const { status, id } = await this.taskTypeService.addUserTaskType(params);
    if (status === 1) {
      const taskType = await this.taskTypeService.getTaskTypeDetail(id, userId);
      return {
        code: 200,
        result: taskType,
      };
    }
  }

  @ApiOperation({ summary: '删除任务类型' })
  @ApiResponse({
    description: '删除任务类型返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/del')
  async delType(@Body() req: DelTypeParams, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const whetherCorrect = await this.taskTypeService.hasTaskType(
      req.typeId,
      userId,
    );
    if (!whetherCorrect) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    const { typeId } = req;
    const tasks = await this.taskTypeService.delTaskType(+typeId);
    return {
      code: 200,
      result: tasks,
      message: '添加成功',
    };
  }

  @ApiOperation({ summary: '更新任务类型' })
  @ApiResponse({
    description: '更新任务类型返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/update')
  async updateTask(@Body() req: UpdateTypeParams, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const whetherCorrect = await this.taskTypeService.hasTaskType(
      req.typeId,
      userId,
    );
    if (!whetherCorrect) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    const timeString = Date.now();
    const params: any = {
      ...req,
    };
    params.updateTime = timeString;
    await this.taskTypeService.updateTaskType(params);
    return {
      code: 200,
      result: { ...params, userId },
      message: '更新成功',
    };
  }
}
