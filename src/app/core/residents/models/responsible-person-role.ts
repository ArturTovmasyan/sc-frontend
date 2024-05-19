import {Space} from '../../models/space';

export class ResponsiblePersonRole implements IdInterface {
  id: number;

  title: string;

  icon: string;

  space: Space;
}
