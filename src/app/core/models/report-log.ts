import {User} from './user';

export class ReportLog implements IdInterface {
  id: number;
  title: string;
  format: string;
  created_at: Date;
  created_by: User;
}
