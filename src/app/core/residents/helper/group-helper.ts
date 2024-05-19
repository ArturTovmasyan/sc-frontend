import {Apartment} from '../models/apartment';
import {Facility} from '../models/facility';
import {Region} from '../models/region';
import {GroupType} from '../models/group-type.enum';

export class GroupHelper {
  public apartments: Apartment[];
  public facilities: Facility[];
  public regions: Region[];

  public no_admission: any = {id: 0};

  get_group_data(id: number, type: GroupType) {
    let group = null;

    switch (type) {
      case GroupType.FACILITY:
        if (this.facilities) {
          group = this.facilities.filter(v => v.id === id).pop();
        }
        break;
      case GroupType.REGION:
        if (this.regions) {
          group = this.regions.filter(v => v.id === id).pop();
        }
        break;
      case GroupType.APARTMENT:
        if (this.apartments) {
          group = this.apartments.filter(v => v.id === id).pop();
        }
        break;
      default:
        break;
    }

    if (group === undefined) {
      group = null;
    }

    return group;
  }
}
