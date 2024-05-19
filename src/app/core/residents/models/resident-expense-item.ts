import {ExpenseItem} from './expense-item';
import {Resident} from './resident';

export class ResidentExpenseItem implements IdInterface {
  id: number;

  date: Date;

  expense_item: ExpenseItem;

  amount: number;
  notes: string;

  resident: Resident;
}
