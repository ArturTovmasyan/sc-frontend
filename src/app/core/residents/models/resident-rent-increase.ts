import {Resident} from './resident';
import {RentReason} from './rent-reason';

export class ResidentRentIncrease implements IdInterface {
  id: number;

  amount: number;

  effective_date: Date;
  notification_date: Date;

  reason: RentReason;

  resident: Resident;
}
