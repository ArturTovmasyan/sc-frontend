import {Apartment} from '../models/apartment';
import {Facility} from '../models/facility';
import {Region} from '../models/region';
import {GroupType} from '../models/group-type.enum';
import {ResidentAdmission} from '../models/resident-admission';

export class GroupHelper {
  public apartments: Apartment[];
  public facilities: Facility[];
  public regions: Region[];

  public no_admission: any = {id: 0};

  public static get_group_id(admission: ResidentAdmission): number | null {
    let group_id = null;
    if (admission.group_type) {
      switch (admission.group_type) {
        case GroupType.FACILITY:
          group_id = admission.facility_bed.room.facility.id;
          break;
        case GroupType.REGION:
          group_id = admission.region.id;
          break;
        case GroupType.APARTMENT:
          group_id = admission.apartment_bed.room.apartment.id;
          break;
      }
    }

    return group_id;
  }

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
