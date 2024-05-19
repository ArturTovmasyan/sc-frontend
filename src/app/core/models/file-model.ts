import {ElementRef} from '@angular/core';

export class FileModel {
  file_name: string;
  size_exceed: boolean;
  form_item: string;
  element: ElementRef;


  public static truncate(value: string, length: number): string {
    return value.length > length ? (value.slice(0, length - 3) + '...') : value;
  }
}
