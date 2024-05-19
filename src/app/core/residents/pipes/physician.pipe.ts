import {Pipe, PipeTransform} from '@angular/core';
import {Physician} from '../models/physician';

@Pipe({name: 'physician'})
export class PhysicianPipe implements PipeTransform {
  transform(value: Physician) {
    return value.salutation.title + ', ' + value.first_name + ' ' + value.last_name;
  }
}
