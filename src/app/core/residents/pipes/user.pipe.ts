import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../../models/user';

@Pipe({name: 'user'})
export class UserPipe implements PipeTransform {
  transform(value: User) {
    if (value) {
      return value.first_name + ' ' + value.last_name;
    } else {
      return null;
    }
  }
}
