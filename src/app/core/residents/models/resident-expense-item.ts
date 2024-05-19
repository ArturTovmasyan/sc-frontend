import {ExpenseItem} from './expense-item';

export class ResidentExpenseItem implements IdInterface {
  id: number;

  date: Date;

  expense_item: ExpenseItem;

  amount: number;
  notes: string;
}
