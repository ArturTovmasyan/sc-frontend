import {Facility} from '../../residents/models/facility';

export class Document implements IdInterface {
  id: number;

  title: string;
  description: string;

  facilities: Facility[];

  file: any; // PDF blob separate
  extension?: any;
  file_name: string;

  date_uploaded: Date;
}
