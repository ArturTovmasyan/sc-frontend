import {Resident} from './resident';
import {ApartmentRoom} from './apartment-room';

export class ApartmentBed implements IdInterface {
  id: number;

  number: string;

  disabled: boolean;

  resident: Resident;

  room?: ApartmentRoom;

  resident_id?: number;
}

