import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'str'})
export class StringPipe implements PipeTransform {
  transform(value: Object) {
    if (value) {
      return value.toString();
    } else {
      return null;
    }
  }
}
