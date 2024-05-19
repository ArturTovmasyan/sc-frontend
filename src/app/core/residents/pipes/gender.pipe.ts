import {Pipe, PipeTransform} from '@angular/core';
import {Gender} from '../models/gender.enum';

@Pipe({name: 'gender'})
export class GenderPipe implements PipeTransform {
  transform(value: Gender): string {
    switch (value) {
      case Gender.MALE:
        return 'Male';
      case Gender.FEMALE:
        return 'Female';
      default:
        return value;
    }
  }
}
