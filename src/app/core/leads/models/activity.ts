import {ActivityType} from './activity-type';
import {ActivityStatus} from './activity-status';
import {User} from '../../models/user';
import {Facility} from '../../residents/models/facility';
import {Lead} from './lead';
import {Organization} from './organization';
import {Referral} from './referral';

export class Activity implements IdInterface {
  id: number;
  title: string;

  owner_type: ActivityOwnerType;
  type: ActivityType;

  date: Date;

  due_date: Date;
  reminder_date: Date;

  facility: Facility;
  lead: Lead;

  referral: Referral;
  organization: Organization;

  notes: string;
  status: ActivityStatus;

  assign_to: User;
}

export enum ActivityOwnerType {
  LEAD = 1,
  REFERRAL = 2,
  ORGANIZATION = 3,
  OUTREACH = 4
}
