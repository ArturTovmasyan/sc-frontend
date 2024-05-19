import {ElementRef} from '@angular/core';

export class FileModel {
  file_name: string;
  full_file_name?: string;
  extension?: string;
  size_exceed: boolean;
  form_item: string;
  element: ElementRef;
}

