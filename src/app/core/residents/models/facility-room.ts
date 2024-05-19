import {Facility} from './facility';
import {RoomType} from './room-type.enum';

export class FacilityRoom implements IdInterface {
  id: number;

  number: string;
  floor: number;

  disabled: boolean;
  shared: boolean;
  notes: string;

  type: RoomType;
  facility: Facility;
}
