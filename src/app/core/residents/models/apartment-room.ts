import {Apartment} from './apartment';
import {ApartmentBed} from './apartment-bed';

export class ApartmentRoom implements IdInterface {
  id: number;

  number: string;
  floor: number;

  disabled: boolean;
  notes: string;

  private: boolean;

  beds: ApartmentBed[];

  apartment: Apartment;
}
