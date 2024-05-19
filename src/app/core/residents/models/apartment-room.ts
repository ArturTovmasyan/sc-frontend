import {Apartment} from './apartment';
import {Resident} from './resident';

export class ApartmentRoom implements IdInterface {
  id: number;

  number: string;
  floor: number;

  disabled: boolean;
  notes: string;

  beds: ApartmentBed[];

  apartment: Apartment;
}

export class ApartmentBed implements IdInterface {
  id: number;

  number: string;

  disabled: boolean;

  resident: Resident;

  room?: ApartmentRoom;

  resident_id?: number;
}

