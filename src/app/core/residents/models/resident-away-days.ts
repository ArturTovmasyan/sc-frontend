import {Resident} from './resident';

export class ResidentAwayDays implements IdInterface {
  id: number;

  start: Date;
  end: Date;

  reason: string;

  resident: Resident;
}
