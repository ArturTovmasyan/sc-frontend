import {Space} from '../../models/space';
import {AssessmentCareLevelGroup} from './assessment-care-level-group';
import {AssessmentCategory} from './assessment-category';

export class AssessmentForm implements IdInterface {
  id: number;
  title: string;

  care_level_groups: AssessmentCareLevelGroup[];
  categories: AssessmentCategory[];

  space: Space;
}
