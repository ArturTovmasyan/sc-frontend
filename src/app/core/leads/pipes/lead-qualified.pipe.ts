import {Pipe, PipeTransform} from '@angular/core';
import {Qualified} from '../models/lead';

@Pipe({name: 'lead_qualified'})
export class LeadQualifiedPipe implements PipeTransform {
  transform(value: Qualified) {
    switch (value) {
      case Qualified.YES:
        return 'Yes';
      case Qualified.NOT_SURE:
        return 'Not Sure';
      case  Qualified.NO:
        return 'No';
      default:
        return value;
    }
  }
}
