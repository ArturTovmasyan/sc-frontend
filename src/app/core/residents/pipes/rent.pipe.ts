import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {ResidentRent} from '../models/resident-rent';

@Pipe({name: 'rent'})
export class RentPipe implements PipeTransform {
  transform(value: ResidentRent) {
    if (value) {
      return (new CurrencyPipe('en-US')).transform(value.amount, 'USD', 'symbol-narrow', '1.2-2');
    } else {
      return null;
    }
  }
}
