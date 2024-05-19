import {KeyFinanceCategory} from '../../models/key-finance-category.enum';

export class KeyFinanceType implements IdInterface {
  id: number;

  type: KeyFinanceCategory;

  title: string;
  description: string;
}
