import {QualificationRequirement} from './qualification-requirement';

export class LeadQualificationRequirement implements IdInterface {
  id: number;

  qualification_requirement: QualificationRequirement;

  qualified: Qualified;
}

export enum Qualified {
    YES = 1,
    NOT_SURE = 2,
    NO = 3
}
