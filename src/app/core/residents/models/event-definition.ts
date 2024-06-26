import {Space} from '../../models/space';

export class EventDefinition implements IdInterface {
  id: number;

  title: string;

  view: EventDefinitionView;
  type: EventDefinitionType;

  in_chooser: boolean;

  ffc: boolean;
  ihc: boolean;
  il: boolean;
  physician: boolean;
  physician_optional: boolean;
  responsible_person: boolean;
  responsible_person_optional: boolean;
  responsible_person_multi: boolean;
  responsible_person_multi_optional: boolean;
  hospice_provider: boolean;
  additional_date: boolean;

  residents: boolean;
  users: boolean;
  duration: boolean;
  repeats: boolean;
  rsvp: boolean;

  done: boolean;

  space: Space;

}

export enum EventDefinitionView {
  RESIDENT = 1,
  FACILITY = 2,
  CORPORATE = 3
}

export enum EventDefinitionType {
  NONE = 1,
  ABSENCE = 2,
  ASSESSMENT = 3
}

export enum RepeatType {
  EVERY_DAY = 1,
  EVERY_WEEK = 2,
  EVERY_MONTH = 3
}

export enum CalendarEventType {
  RESIDENT = 1,
  FACILITY = 2,
  CORPORATE = 3,
  ADMISSION = 4,
  RENT = 5,
  RENT_INCREASE = 6,
  AWAY_DAYS = 7,
}
