import {Resident} from './resident';
import {AssessmentForm} from './assessment-form';

export class ResidentAssessment implements IdInterface {
  id: number;

  resident: Resident;

  form: AssessmentForm;
}

export enum AssessmentReportType {
  FILLED = 1,
  BLANK = 2
}
