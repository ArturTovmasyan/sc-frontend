import {Space} from '../../models/space';

export class EventDefinition implements IdInterface {
  id: number;

  title: string;

  ffc: boolean;
  ihc: boolean;
  il: boolean;
  physician: boolean;
  responsible_person: boolean;
  additional_date: boolean;

  space: Space;

}
