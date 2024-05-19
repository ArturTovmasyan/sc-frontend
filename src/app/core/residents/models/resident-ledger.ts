import {Resident} from './resident';
import {PaymentSource} from './payment-source';
import {ResidentExpenseItem} from './resident-expense-item';
import {ResidentCreditItem} from './resident-credit-item';
import {ResidentDiscountItem} from './resident-discount-item';
import {ResidentPaymentReceivedItem} from './resident-payment-received-item';
import {ResidentAwayDays} from './resident-away-days';

export class ResidentLedger implements IdInterface {
  id: number;

  resident: Resident;

  date_created: Date;

  amount: number;

  balance_due: number;
  private_pay_balance_due: number;
  not_private_pay_balance_due: number;
  prior_private_pay_balance_due: number;

  source: { key: PaymentSource, value: number } [];
  privat_pay_source: { key: PaymentSource, value: number } [];
  not_privat_pay_source: { key: PaymentSource, value: number } [];

  resident_expense_items: ResidentExpenseItem[];
  resident_credit_items: ResidentCreditItem[];
  resident_discount_items: ResidentDiscountItem[];
  resident_payment_received_items: ResidentPaymentReceivedItem[];
  resident_away_days: ResidentAwayDays[];

  next_ledger_id: number;
  previous_ledger_id: number;
}
