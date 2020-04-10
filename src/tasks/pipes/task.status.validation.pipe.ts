import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this._isValidStatus(value)) {
      throw new BadRequestException(`${value} is not a valid status`);
    }

    return value;
  }

  private _isValidStatus(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
