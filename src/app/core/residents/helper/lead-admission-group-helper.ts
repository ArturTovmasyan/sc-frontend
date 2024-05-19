import {Facility} from '../models/facility';
import {GroupType} from '../models/group-type.enum';
import {Admission} from '../../leads/models/admission';

export class GroupHelper {

  public facilities: Facility[];

  public no_admission: any = {id: 0};

  public static get_group_id(admission: Admission): number | null {
    return admission.facility_bed.room.facility.id;
  }

  get_group_data(id: number, type: GroupType) {
    let group = null;

    switch (type) {
      case GroupType.FACILITY:
        if (this.facilities) {
          group = this.facilities.filter(v => v.id === id).pop();
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
