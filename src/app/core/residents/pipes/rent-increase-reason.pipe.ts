import {Pipe, PipeTransform} from '@angular/core';
import {ResidentRentIncreaseReason} from '../models/resident-rent-increase';

@Pipe({name: 'rent_increase_reason'})
export class RentIncreaseReasonPipe implements PipeTransform {
  transform(value: ResidentRentIncreaseReason) {
    switch (value) {
      case ResidentRentIncreaseReason.ANNUAL:
        return 'Annual';
      case ResidentRentIncreaseReason.CARE_LEVEL_ADJUSTMENT:
        return 'Care Level Adjustment';
      default:
        return value;
    }
  }
}
