import {Resident} from './resident';
import {FacilityRoom} from './facility-room';

export class FacilityBed implements IdInterface {
  id: number;

  number: string;

  disabled: boolean;

  resident: Resident;

  room?: FacilityRoom;

  resident_id?: number;
}

