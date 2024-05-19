import {Space} from '../../models/space';
import {AssessmentCareLevelGroup} from './assessment-care-level-group';

export class AssessmentCareLevel implements IdInterface {
  id: number;

  title: string;

  level_low: number;
  level_high: number;

  care_level_group: AssessmentCareLevelGroup;

  space: Space;
}
