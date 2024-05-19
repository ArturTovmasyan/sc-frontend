import {Lead} from './lead';
import {Temperature} from './temperature';

export class LeadTemperature implements IdInterface {
  id: number;

  lead: Lead;
  temperature: Temperature;

  date: Date;

  notes: string;
}

