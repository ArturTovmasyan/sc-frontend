import {Resident} from './resident';

export class ResidentAssessment implements IdInterface {
  id: number;

  resident: Resident;
}

export enum AssessmentReportType {
  FILLED = 1,
  BLANK = 2
}
