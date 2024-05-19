import {Lead} from './lead';
import {AssessmentForm} from '../../residents/models/assessment-form';

export class LeadAssessment implements IdInterface {
  id: number;

  resident: Lead;

  form: AssessmentForm;
}

export enum AssessmentReportType {
  FILLED = 1,
  BLANK = 2
}
