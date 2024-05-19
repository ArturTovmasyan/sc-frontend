import {ReferrerType} from './referrer-type';
import {Organization} from './organization';
import {Phone} from '../../models/phone';
import {Lead} from './lead';

export class Referral implements IdInterface {
  id: number;

  first_name: string;
  last_name: string;

  notes: string;

  phones: Phone[];
  emails: string[];

  lead: Lead;
  type: ReferrerType;
  organization: Organization;
}
