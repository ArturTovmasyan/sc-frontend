import {Organization} from './organization';
import {Contact} from './contact';
import {OutreachType} from './outreach-type';
import {User} from '../../models/user';

export class Outreach implements IdInterface {
  id: number;

  date: Date;
  type: OutreachType;

  users: User[];
  contacts: Contact[];

  organization: Organization;

  notes: string;

}
