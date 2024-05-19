import {Space} from '../../models/space';

export class AssessmentCategory implements IdInterface {
  id: number;

  title: string;
  multi_item: boolean;
  rows: AssessmentCategoryRow[];
  space: Space;

  disabled: boolean;
}

export class AssessmentCategoryRow implements IdInterface {
  id: number;

  title: string;
  score: number;

  order_number: number;
}
