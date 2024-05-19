import {LeadQualificationRequirement} from './lead-qualification-requirement';

export class Qualification implements IdInterface {
  id: number;

  qualified: boolean;
  qualifications: LeadQualificationRequirement[];
}

export enum Qualified {
    YES = 1,
    NOT_SURE = 2,
    NO = 3
}