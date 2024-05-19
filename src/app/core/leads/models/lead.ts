import {Referral} from './referral';
import {Phone} from '../../models/phone';
import {Facility} from '../../residents/models/facility';
import {CityStateZip} from '../../residents/models/city-state-zip';
import {CareType} from './care-type';
import {PaymentSource} from '../../residents/models/payment-source';
import {User} from '../../models/user';
import {CurrentResidence} from './current-residence';
import {Hobby} from './hobby';
import {CareLevel} from '../../residents/models/care-level';

export class Lead implements IdInterface {
  id: number;

  state: LeadState;

  first_name: string;
  last_name: string;

  care_type: CareType;
  care_level: CareLevel;
  payment_type: PaymentSource;
  owner: User;
  initial_contact_date: Date;

  birthday: Date;
  spouse_name: string;
  current_residence: CurrentResidence;

  responsible_person_first_name: string;
  responsible_person_last_name: string;
  responsible_person_address_1: string;
  responsible_person_address_2: string;
  responsible_person_email: string;
  responsible_person_phone: string;
  responsible_person_csz: CityStateZip;

  referral: Referral;

  primary_facility: Facility;
  facilities: Facility[];
  hobbies: Hobby[];
  notes: string;
  phones: Phone[];

  web_lead: boolean;
  spam: boolean;
  next_lead_id: number;
  previous_lead_id: number;

  funnel_stage: string;
  temperature: string;
}

export enum LeadState {
  OPEN = 1,
  CLOSED = 2
}
