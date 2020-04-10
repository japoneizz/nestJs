import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { v1 as uuidv1 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private _tasks: Array<ITask> = [];

  getAllTasks(): Array<ITask> {
    return this._tasks;
  }

  getTaskWithFilter(filterDto: GetTaskFilterDto): Array<ITask> {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): ITask {
    const task = this._tasks.find(task => task.id === id);

    if (!task) {
        throw new NotFoundException(`Task with id '${ id }' not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): ITask {
    const { title, description } = createTaskDto;

    const newTask: ITask = {
      id: uuidv1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this._tasks.push(newTask);
    return newTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): ITask {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    const foundTask = this.getTaskById(id);
    this._tasks = this._tasks.filter(task => task.id !== foundTask.id);
  }
}
