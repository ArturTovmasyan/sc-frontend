import {CareLevel} from './care-level';
import {FacilityRoomType} from './facility-room-type';

export class FacilityRoomBaseRate implements IdInterface {
  id: number;

  date: Date;

  room_type: FacilityRoomType;

  levels: any[];

  public get_amount(care_level: CareLevel): number {
    const care_level_rate = this.levels
      .filter(level => level.care_level.id === care_level.id)
      .map(level => level.amount).pop();

    return care_level_rate ? care_level_rate : 0;
  }
}
