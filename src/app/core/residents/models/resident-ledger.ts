import {Resident} from './resident';
import {PaymentSource} from './payment-source';
import {ResidentExpenseItem} from './resident-expense-item';
import {ResidentCreditItem} from './resident-credit-item';
import {ResidentDiscountItem} from './resident-discount-item';
import {ResidentPrivatePayPaymentReceivedItem} from './resident-private-pay-payment-received-item';
import {ResidentNotPrivatePayPaymentReceivedItem} from './resident-not-private-pay-payment-received-item';
import {LatePayment} from './late-payment';

export class ResidentLedger implements IdInterface {
  id: number;

  resident: Resident;

  late_payment: LatePayment;

  date_created: Date;

  private_pay_balance_due: number;
  not_private_pay_balance_due: number;
  prior_private_pay_balance_due: number;
  prior_not_private_pay_balance_due: number;

  source: { key: PaymentSource, value: number } [];
  privat_pay_source: { key: PaymentSource, value: number } [];
  not_privat_pay_source: { key: PaymentSource, value: number } [];
  away_days: { key: string, value: number } [];

  resident_expense_items: ResidentExpenseItem[];
  resident_credit_items: ResidentCreditItem[];
  resident_discount_items: ResidentDiscountItem[];
  resident_private_pay_payment_received_items: ResidentPrivatePayPaymentReceivedItem[];
  resident_not_private_pay_payment_received_items: ResidentNotPrivatePayPaymentReceivedItem[];

  next_ledger_id: number;
  previous_ledger_id: number;
}
