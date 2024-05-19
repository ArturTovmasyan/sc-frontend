import {Resident} from './resident';

export class ResidentRentIncrease implements IdInterface {
  id: number;

  amount: number;

  effective_date: Date;
  notification_date: Date;

  reason: ResidentRentIncreaseReason;

  resident: Resident;
}

export enum ResidentRentIncreaseReason {
  ANNUAL = 0,
  CARE_LEVEL_ADJUSTMENT = 1
}
