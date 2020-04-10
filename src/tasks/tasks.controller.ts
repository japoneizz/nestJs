import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task.status.validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private _taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Array<ITask> {
    if (Object.keys(filterDto).length) {
        return this._taskService.getTaskWithFilter(filterDto);
    }

    return this._taskService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): ITask {
    return this._taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this._taskService.createTask(createTaskDto);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): ITask {
    return this._taskService.updateTaskStatus(id, status);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): void {
    this._taskService.deleteTask(id);
  }
}
