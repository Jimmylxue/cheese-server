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
  UserTaskParams,
  DetailParams,
  AddTaskParams,
  DelParams,
  UpdateTaskParams,
  UpdateTaskStatusParams,
  SearchParams,
} from './dto/task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  TaskDetailResponseDto,
  TaskResponseDto,
  TaskSearchResponseDto,
} from './dto/taskResponse.dto';
import { BaseResponseDto } from 'src/common/dto/response.dto';

@ApiTags('待办事项-任务')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: '查看任务列表' })
  @ApiResponse({
    description: '任务列表返回',
    type: TaskResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/list')
  async getUserType(@Body() req: UserTaskParams, @Req() auth) {
    const {
      page,
      pageSize,
      startTime,
      endTime,
      status,
      typeId,
      sort = 'DESC',
    } = req;
    const { user } = auth;
    const userId = user.userId;
    const params = {
      userId,
      page,
      pageSize,
      startTime,
      endTime,
      status,
      typeId,
      sort,
    };
    const { result, total } = await this.taskService.getUserTask(params);
    return {
      code: 200,
      message: '请求成功',
      result: {
        page,
        result,
        total,
      },
    };
  }

  @ApiOperation({ summary: '查看任务详情' })
  @ApiResponse({
    description: '任务详情返回',
    type: TaskDetailResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/detail')
  async getTypeDetail(@Body() req: DetailParams, @Req() auth) {
    const { taskId } = req;
    const { user } = auth;
    const userId = user.userId;
    const task = await this.taskService.getTaskDetail(+taskId, userId);
    if (!task) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: task,
    };
  }

  @ApiOperation({ summary: '添加任务' })
  @ApiResponse({
    description: '添加任务返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/add')
  async addUserType(@Body() req: AddTaskParams, @Req() auth) {
    const { typeId, taskName, taskContent, expectTime } = req;
    const { user } = auth;
    const userId = user.userId;
    const params = {
      userId,
      typeId,
      taskName,
      taskContent,
      createTime: String(Date.now()),
      expectTime,
    };
    const { status, id } = await this.taskService.addUserTask(params);
    if (status === 1) {
      const task = await this.taskService.getTaskDetail(id, userId);
      return {
        code: 200,
        result: task,
        message: '添加成功',
      };
    }
  }

  @ApiOperation({ summary: '删除任务' })
  @ApiResponse({
    description: '删除任务返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/del')
  async delType(@Body() req: DelParams, @Req() auth) {
    const { taskId } = req;
    const { user } = auth;
    const userId = user.userId;
    const whetherCorrect = await this.taskService.hasTask(taskId, userId);
    if (!whetherCorrect) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    const tasks = await this.taskService.delTask(+taskId);
    return {
      code: 200,
      result: tasks,
    };
  }

  @ApiOperation({ summary: '更新任务状态' })
  @ApiResponse({
    description: '更新任务状态返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/updateStatus')
  async updateTaskStatus(@Body() req: UpdateTaskStatusParams, @Req() auth) {
    const timeString = Date.now();
    const { user } = auth;
    const userId = user.userId;

    const whetherCorrect = await this.taskService.hasTask(req.taskId, userId);
    if (!whetherCorrect) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }

    const params: any = {
      ...req,
      userId,
    };
    if (req.status === 1) {
      params.completeTime = timeString;
    }
    params.updateTime = timeString;
    await this.taskService.updateTaskStatus(params);
    const task = await this.taskService.getTaskDetail(req.taskId, userId);
    return {
      code: 200,
      result: { ...task, status: req.status },
      message: '更新成功',
    };
  }

  @ApiOperation({ summary: '更新任务信息' })
  @ApiResponse({
    description: '更新任务信息返回',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/update')
  async updateTask(@Body() req: UpdateTaskParams, @Req() auth) {
    const timeString = Date.now();
    const { user } = auth;
    const userId = user.userId;

    const whetherCorrect = await this.taskService.hasTask(req.taskId, userId);
    if (!whetherCorrect) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }

    const params: any = {
      ...req,
      userId,
    };
    params.updateTime = timeString;
    await this.taskService.updateTask(params);
    const task = await this.taskService.getTaskDetail(req.taskId, userId);
    return {
      code: 200,
      result: {
        task,
        ...params,
      },
      message: '更新成功',
    };
  }

  @ApiOperation({ summary: '搜索任务' })
  @ApiResponse({
    description: '任务列表返回',
    type: TaskSearchResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/search')
  async getSearchTask(@Body() req: SearchParams, @Req() auth) {
    const { taskName } = req;
    const { user } = auth;
    const userId = user.userId;
    const searchRes = await this.taskService.getTaskListByName(
      userId,
      taskName,
    );
    return {
      code: 200,
      result: searchRes,
    };
  }
}
