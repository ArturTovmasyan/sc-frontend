import {EmailReviewType} from './email-review-type';
import {Facility} from '../../residents/models/facility';
import {User} from '../../models/user';

export class WebEmail implements IdInterface {
  id: number;

  date: Date;

  facility: Facility;
  email_review_type: EmailReviewType;
  updated_by: User;

  subject: string;
  body: string;

  next_email_id: number;
  previous_email_id: number;
}
