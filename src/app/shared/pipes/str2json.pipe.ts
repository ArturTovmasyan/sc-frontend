import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'str2json'})
export class String2JsonPipe implements PipeTransform {
  transform(value: string) {
    let result: string;
    try {
      result = JSON.parse(value);
    } catch (e) {
      result = value;
    }
    return result;
  }
}
