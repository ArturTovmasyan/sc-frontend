import {Resident} from './resident';
import {GroupType} from './group-type.enum';
import {ApartmentBed, ApartmentRoom} from './apartment-room';
import {FacilityBed, FacilityRoom} from './facility-room';
import {FacilityDiningRoom} from './facility-dining-room';
import {CareLevel} from './care-level';
import {Region} from './region';
import {CityStateZip} from './city-state-zip';

export class ResidentContract implements IdInterface {
  id: number;

  start: Date;
  end: Date;

  type: GroupType;
  option: ContractOptionApartment | ContractOptionFacility | ContractOptionRegion;

  resident: Resident;
}

export enum State {
  ACTIVE = 1,
  SUSPENDED = 2,
  TERMINATED = 3
}

export class ContractOptionApartment implements IdInterface {
  id: number;

  state: State;

  room?: ApartmentRoom;
  bed?: ApartmentBed;
}

export class ContractOptionFacility implements IdInterface {
  id: number;

  state: State;

  room?: FacilityRoom;
  bed?: FacilityBed;

  dining_room: FacilityDiningRoom;

  ambulatory: boolean;
  care_group: number;
  care_level: CareLevel;
  dnr: boolean;
  polst: boolean;
}

export class ContractOptionRegion implements IdInterface {
  id: number;

  state: State;

  region: Region;
  csz: CityStateZip;
  street_address: string;

  ambulatory: boolean;
  care_group: number;
  care_level: CareLevel;
  dnr: boolean;
  polst: boolean;
}
