import {Pipe, PipeTransform} from '@angular/core';
import {AdmissionType} from '../models/resident-admission';

@Pipe({name: 'admission_type'})
export class AdmissionTypePipe implements PipeTransform {
  transform(value: AdmissionType) {
    switch (value) {
      case AdmissionType.LONG_ADMIT:
        return 'Long-Term Admit';
      case AdmissionType.SHORT_ADMIT:
        return 'Short-Term Admit';
      case  AdmissionType.READMIT:
        return 'Re-admit';
      case  AdmissionType.PENDING_DISCHARGE:
        return 'Pending Discharge';
      case  AdmissionType.TEMPORARY_DISCHARGE:
        return 'Temporary Discharge';
      case  AdmissionType.DISCHARGE:
        return 'Discharge';
      default:
        return value;
    }
  }
}
