import {KeyFinanceCategory} from '../../models/key-finance-category.enum';

export class KeyFinanceDates implements IdInterface {
  id: number;

  type: KeyFinanceCategory;

  title: string;

  date: Date;

  description: string;
}
