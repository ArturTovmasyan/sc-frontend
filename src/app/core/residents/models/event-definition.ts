import {Space} from '../../models/space';

export class EventDefinition implements IdInterface {
  id: number;

  title: string;

  ffc: boolean;
  ihc: boolean;
  il: boolean;
  physician: boolean;
  physician_optional: boolean;
  responsible_person: boolean;
  responsible_person_optional: boolean;
  responsible_person_multi: boolean;
  responsible_person_multi_optional: boolean;
  additional_date: boolean;

  space: Space;

}
