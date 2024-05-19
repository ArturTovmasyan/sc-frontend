import {Facility} from './facility';
import {FacilityBed} from './facility-bed';

export class FacilityRoom implements IdInterface {
  id: number;

  number: string;
  floor: number;

  disabled: boolean;
  notes: string;

  private: boolean;

  beds: FacilityBed[];

  facility: Facility;
}
