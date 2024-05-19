import {KeyFinanceType} from './key-finance-type';

export class ResidentKeyFinanceDate implements IdInterface {
  id: number;

  date: Date;

  key_finance_type: KeyFinanceType;
}
