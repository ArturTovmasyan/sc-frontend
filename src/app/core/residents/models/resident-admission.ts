import {Resident} from './resident';
import {GroupType} from './group-type.enum';
import {ApartmentBed} from './apartment-room';
import {FacilityBed} from './facility-room';
import {FacilityDiningRoom} from './facility-dining-room';
import {CareLevel} from './care-level';
import {Region} from './region';
import {CityStateZip} from './city-state-zip';

export class ResidentAdmission implements IdInterface {
  id: number;

  type: AdmissionType;
  date: Date;
  notes: string;

  resident: Resident;

  // -----
  start: Date;
  end: Date;
  // -----
  group_type: GroupType;

  facility_bed?: FacilityBed;
  dining_room?: FacilityDiningRoom;

  apartment_bed?: ApartmentBed;

  region?: Region;
  csz?: CityStateZip;
  address?: string;

  ambulatory?: boolean;
  care_group?: number;
  care_level?: CareLevel;
  dnr?: boolean;
  polst?: boolean;
  // -----
}

export enum AdmissionType {
  ADMIT = 1,
  READMIT = 2,
  TEMPORARY_DISCHARGE = 3,
  DISCHARGE = 4
}
