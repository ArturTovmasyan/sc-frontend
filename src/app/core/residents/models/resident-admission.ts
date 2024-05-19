import {Resident} from './resident';
import {GroupType} from './group-type.enum';
import {ApartmentBed} from './apartment-bed';
import {FacilityBed} from './facility-bed';
import {FacilityDiningRoom} from './facility-dining-room';
import {CareLevel} from './care-level';
import {Region} from './region';
import {CityStateZip} from './city-state-zip';

export class ResidentAdmission implements IdInterface {
  id: number;

  admission_type: AdmissionType;
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
  LONG_ADMIT = 1,
  SHORT_ADMIT = 2,
  READMIT = 3,
  ROOM_CHANGE = 4,
  TEMPORARY_DISCHARGE = 5,
  PENDING_DISCHARGE = 6,
  DISCHARGE = 7
}
