import {PhoneType} from './phone-type.enum';
import {PhoneCompatability} from './phone-compatability.enum';

export class Phone implements IdInterface {
  id: number;

  type: PhoneType;
  number: string;
  extension: number;

  primary: boolean;
  sms_enabled: boolean;

  compatibility: PhoneCompatability;
}
