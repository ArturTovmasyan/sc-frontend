import {Pipe, PipeTransform} from '@angular/core';
import {CityStateZip} from '../models/city-state-zip';

@Pipe({name: 'csz'})
export class CityStateZipPipe implements PipeTransform {
  transform(value: CityStateZip) {
    return value.city + ' ' + value.state_abbr + ', ' + value.zip_main;
  }
}
