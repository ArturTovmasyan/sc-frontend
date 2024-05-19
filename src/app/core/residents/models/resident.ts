import {Salutation} from './salutation';
import {Gender} from './gender.enum';
import {Phone} from './phone';
import {ApartmentRoom} from './apartment-room';
import {FacilityRoom} from './facility-room';
import {FacilityDiningRoom} from './facility-dining-room';
import {CityStateZip} from './city-state-zip';
import {Region} from './region';
import {CareLevel} from './care-level';
import {ResponsiblePerson} from './responsible-person';
import {Physician} from './physician';
import {ResidentType} from './resident-type.enum';

export class Resident implements IdInterface {
  id: number;

  salutation: Salutation;

  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: Date;

  photo: string;
  gender: Gender;

  phones: Phone[];

  type: ResidentType;
  option: ResidentApartmentOption | ResidentFacilityOption | ResidentRegionOption;

  responsible_persons?: ResponsiblePerson[];
  physicians?: Physician[];
}

export class ResidentApartmentOption implements IdInterface, ResidentStatus {
  id: number;
  room: ApartmentRoom;

  date_admitted: Date;
  state: State;
}

export class ResidentFacilityOption implements IdInterface, ResidentStatus, ResidentCare {
  id: number;

  room: FacilityRoom;
  dining_room: FacilityDiningRoom;

  date_admitted: Date;
  state: State;

  ambulatory: boolean;
  care_group: number;
  care_level: CareLevel;
  dnr: boolean;
  polst: boolean;
}

export class ResidentRegionOption implements IdInterface, ResidentStatus, ResidentCare {
  id: number;

  region: Region;
  csz: CityStateZip;
  street_address: string;

  date_admitted: Date;
  state: State;

  ambulatory: boolean;
  care_group: number;
  care_level: CareLevel;
  dnr: boolean;
  polst: boolean;
}

export enum State {
  ACTIVE = 1,
  INACTIVE = 2,
}

interface ResidentStatus {
  date_admitted: Date;
  state: State;
}

interface ResidentCare {
  dnr: boolean;
  polst: boolean;
  ambulatory: boolean;

  care_group: number;

  care_level: CareLevel;
}
