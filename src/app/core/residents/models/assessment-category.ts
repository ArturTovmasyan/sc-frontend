import {Space} from '../../models/space';

export class AssessmentCategory implements IdInterface {
  id: number;

  title: string;
  multi_item: boolean;
  rows: AssessmentCategoryRow[];
  space: Space;

  disabled: boolean;
  check_group: { label: string, value: number, checked: boolean }[];
  row: number;
}

export class AssessmentCategoryRow implements IdInterface {
  id: number;

  title: string;
  score: number;

  order_number: number;
}
