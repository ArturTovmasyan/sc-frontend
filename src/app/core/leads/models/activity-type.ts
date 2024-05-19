import {ActivityStatus} from './activity-status';

export class ActivityType implements IdInterface {
  id: number;

  title: string;

  default_status: ActivityStatus;

  assign_to: boolean;
  due_date: boolean;
  reminder_date: boolean;
  cc: boolean;
  sms: boolean;
  document: boolean;
  facility: boolean;

  editable: boolean;
  deletable: boolean;

  extra_fields: string;
}
