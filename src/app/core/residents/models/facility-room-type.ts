import {CareLevel} from './care-level';

export class FacilityRoomType implements IdInterface {
  id: number;

  title: string;

  private: boolean;
  base_rates: any[];

  public get_amount(care_level: CareLevel): number {
    const care_level_rate = this.base_rates
      .filter(base_rate => base_rate.care_level.id === care_level.id)
      .map(base_rate => base_rate.amount).pop();

    return care_level_rate ? care_level_rate : 0;
  }
}
