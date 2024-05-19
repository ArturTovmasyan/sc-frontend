import {Resident} from './resident';
import {PaymentSource} from './payment-source';

export class ResidentLedger implements IdInterface {
  id: number;

  resident: Resident;

  date_created: Date;

  amount: number;

  balance_due: number;

  source: { key: PaymentSource, value: number } [];

  next_ledger_id: number;
  previous_ledger_id: number;
}
