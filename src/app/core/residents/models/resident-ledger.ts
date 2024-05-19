import {Resident} from './resident';

export class ResidentLedger implements IdInterface {
  id: number;

  resident: Resident;

  date_created: Date;

  next_ledger_id: number;
  previous_ledger_id: number;
}
