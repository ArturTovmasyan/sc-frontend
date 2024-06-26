import {Phone} from '../../models/phone';
import {Organization} from './organization';

export class Contact implements IdInterface {
  id: number;

  first_name: string;
  last_name: string;
  emails: string[];
  notes: string;

  phones: Phone[];
  organization: Organization;
}
