import {Pipe, PipeTransform} from '@angular/core';
import {AdmissionType} from '../models/resident-admission';
import {GroupType} from '../models/group-type.enum';

@Pipe({name: 'admission_type'})
export class AdmissionTypePipe implements PipeTransform {
  transform(value: AdmissionType, type?: GroupType) {
    type = type ? type : GroupType.FACILITY;

    let result = value.toString();

    switch (type) {
      case GroupType.FACILITY:
        switch (value) {
          case AdmissionType.LONG_ADMIT:
            result = 'Long-Term Admit';
            break;
          case AdmissionType.SHORT_ADMIT:
            result = 'Short-Term Admit';
            break;
          case  AdmissionType.READMIT:
            result = 'Re-admit';
            break;
          case  AdmissionType.PENDING_DISCHARGE:
            result = 'Pending Discharge';
            break;
          case  AdmissionType.TEMPORARY_DISCHARGE:
            result = 'Temporary Discharge';
            break;
          case  AdmissionType.DISCHARGE:
            result = 'Discharge';
            break;
        }
        break;
      case GroupType.APARTMENT:
        switch (value) {
          case AdmissionType.LONG_ADMIT:
            result = 'Long-Term Rental';
            break;
          case AdmissionType.SHORT_ADMIT:
            result = 'Short-Term Rental';
            break;
          case  AdmissionType.READMIT:
            result = 'Re-admit';
            break;
          case  AdmissionType.PENDING_DISCHARGE:
            result = 'Notice to Vacate';
            break;
          case  AdmissionType.DISCHARGE:
            result = 'Move Out';
            break;
        }
        break;
    }

    return result;
  }
}
