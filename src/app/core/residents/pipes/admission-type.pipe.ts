import {Pipe, PipeTransform} from '@angular/core';
import {AdmissionType} from '../models/resident-admission';

@Pipe({name: 'admission_type'})
export class AdmissionTypePipe implements PipeTransform {
  transform(value: AdmissionType) {
    switch (value) {
      case AdmissionType.ADMIT:
        return 'Admit';
      case  AdmissionType.READMIT:
        return 'Re-admit';
      case  AdmissionType.TEMPORARY_DISCHARGE:
        return 'Temporary Discharge';
      case  AdmissionType.DISCHARGE:
        return 'Discharge';
      default:
        return value;
    }
  }
}
