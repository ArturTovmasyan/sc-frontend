import {Pipe, PipeTransform} from '@angular/core';
import {LeadState} from '../models/lead';

@Pipe({name: 'lead_state'})
export class LeadStatePipe implements PipeTransform {
  transform(value: LeadState) {
    switch (value) {
      case LeadState.OPEN:
        return 'Open';
      case  LeadState.CLOSED:
        return 'Closed';
      default:
        return value;
    }
  }
}
