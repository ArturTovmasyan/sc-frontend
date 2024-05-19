import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'str2json'})
export class String2JsonPipe implements PipeTransform {
  transform(_value: string, merge?: boolean) {
    let _result: any;
    try {
      _result = JSON.parse(_value, (key, value) => {
        let result: any;
        try {
          result = JSON.parse(value);
        } catch (e) {
          result = value;
        }
        return result;
      });
    } catch (e) {
      _result = _value;
    }

    if (_.isArray(_result) && merge) {
      const _result_obj = {};

      _result.forEach(el => {
        Object.keys(el).forEach(key => {
          _result_obj[key] = el[key];
        });
      });

      _result = _result_obj;
    }

    return _result;
  }
}
