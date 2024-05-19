import {ReferrerType} from './referrer-type';
import {Organization} from './organization';
import {Lead} from './lead';
import {Contact} from './contact';

export class Referral implements IdInterface {
  id: number;

  notes: string;

  lead: Lead;
  type: ReferrerType;
  organization: Organization;
  contact: Contact;
}
