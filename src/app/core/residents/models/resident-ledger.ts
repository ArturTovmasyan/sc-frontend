import {Resident} from './resident';

export class ResidentLedger implements IdInterface {
  id: number;

  resident: Resident;

  date_created: Date;

  amount: number;

  balance_due: number;

  next_ledger_id: number;
  previous_ledger_id: number;
}
