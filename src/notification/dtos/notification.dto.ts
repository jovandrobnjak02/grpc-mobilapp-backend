import { IsEnum } from 'class-validator';
import { NotificationType } from '../../constants/notification-type';

export class NotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  timestamp;

  payload?;
}
