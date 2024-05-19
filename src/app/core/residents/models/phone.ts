import {PhoneType} from './phone-type.enum';

export class Phone {
  number: string;
  type: PhoneType;
  primary: boolean;
  sms: boolean;
}
