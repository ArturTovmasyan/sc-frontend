import {Facility} from './facility';
import {Resident} from './resident';

export class FacilityRoom implements IdInterface {
  id: number;

  number: string;
  floor: number;

  disabled: boolean;
  notes: string;

  beds: FacilityBed[];

  facility: Facility;
}

export class FacilityBed implements IdInterface {
  id: number;

  number: string;

  disabled: boolean;

  resident: Resident;

  room?: FacilityRoom;

  resident_id?: number;
}

