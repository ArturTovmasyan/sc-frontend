import {Resident} from './resident';
import {AssessmentForm} from './assessment-form';
import {AssessmentType} from './assessment-type';

export class ResidentAssessment implements IdInterface {
  id: number;

  resident: Resident;

  form: AssessmentForm;

  type: AssessmentType;
}

export enum AssessmentReportType {
  FILLED = 1,
  BLANK = 2
}
