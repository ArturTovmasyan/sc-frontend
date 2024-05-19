import {CareLevel} from './care-level';

export class FacilityRoomType implements IdInterface {
  id: number;

  title: string;

  private: boolean;
  levels: any[];

  public get_amount(care_level: CareLevel): number {
    const care_level_rate = this.levels
      .filter(level => level.care_level.id === care_level.id)
      .map(level => level.amount).pop();

    return care_level_rate ? care_level_rate : 0;
  }
}
