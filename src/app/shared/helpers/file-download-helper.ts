import * as FileSaver from 'file-saver';
import {HttpResponse} from '@angular/common/http';

export const saveFile = (response: HttpResponse<Blob>) => {
  const contentDisposition = response.headers.get('content-disposition') || '';
  const matches = /filename=([^;]+)/ig.exec(contentDisposition);
  const fileName = (matches[1] || 'untitled').trim().replace(/^"(.*)"$/, '$1');

  const blob = new Blob([response.body], {type: 'application/octet-stream'});
  FileSaver.saveAs(blob, fileName);
};
