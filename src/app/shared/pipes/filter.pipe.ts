import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})

@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    if (!items) {
      return [];
    } else {
      return items.filter(it => it[field] === value);
    }
  }
}
