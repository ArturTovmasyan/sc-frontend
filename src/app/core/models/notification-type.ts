import {NotificationCategory} from './notification-category.enum';
import {Space} from './space';

export class NotificationType implements IdInterface {
  id: number;

  category: NotificationCategory;

  title: string;
  sms: boolean;
  email: boolean;

  facility: boolean;
  apartment: boolean;
  region: boolean;

  email_subject: string;
  email_message: string;
  sms_subject: string;
  sms_message: string;

  space: Space;
}
