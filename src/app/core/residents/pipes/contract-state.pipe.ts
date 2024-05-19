import {Pipe, PipeTransform} from '@angular/core';
import {State} from '../models/resident-contract';

@Pipe({name: 'contract_state'})
export class ContractStatePipe implements PipeTransform {
  transform(value: State) {
    switch (value) {
      case State.ACTIVE:
        return 'Active';
      case  State.SUSPENDED:
        return 'Suspended';
      case  State.TERMINATED:
        return 'Terminated';
      default:
        return value;
    }
  }
}
