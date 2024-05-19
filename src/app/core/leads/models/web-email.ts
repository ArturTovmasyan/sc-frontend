import {EmailReviewType} from './email-review-type';
import {Facility} from '../../residents/models/facility';
import {User} from '../../models/user';
import {ReferrerType} from './referrer-type';

export class WebEmail implements IdInterface {
  id: number;

  date: Date;

  facility: Facility;
  email_review_type: EmailReviewType;
  type: ReferrerType;
  updated_by: User;

  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;

  next_email_id: number;
  previous_email_id: number;
}
