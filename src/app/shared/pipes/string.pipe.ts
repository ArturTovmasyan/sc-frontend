import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'str'})
export class StringPipe implements PipeTransform {
  transform(value: Object) {
    return value.toString();
  }
}
