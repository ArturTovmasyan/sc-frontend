import {KeyFinanceCategory} from '../../models/key-finance-category.enum';

export class KeyFinanceDates implements IdInterface {
  id: number;

  type: KeyFinanceCategory;

  title: string;

  day: number;

  description: string;
}
