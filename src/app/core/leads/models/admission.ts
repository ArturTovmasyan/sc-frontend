import {Salutation} from '../../residents/models/salutation';
import {Gender} from '../../residents/models/gender.enum';
import {GroupType} from '../../residents/models/group-type.enum';
import {User} from '../../models/user';
import {FacilityBed} from '../../residents/models/facility-bed';
import {FacilityDiningRoom} from '../../residents/models/facility-dining-room';
import {CareLevel} from '../../residents/models/care-level';

export class Admission implements IdInterface {
    id: number;

    salutation: Salutation;

    first_name: string;
    last_name: string;
    birthday: Date;

    gender: Gender;

    user: User;
    admission_type: AdmissionType;
    date: Date;
    // -----
    group_type: GroupType;

    facility_bed?: FacilityBed;
    dining_room?: FacilityDiningRoom;

    care_group?: number;
    care_level?: CareLevel;
}

export enum AdmissionType {
    LONG_ADMIT = 1,
    SHORT_ADMIT = 2
}