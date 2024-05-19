import {HelpObject} from './help-object';

export class HelpCategory implements IdInterface {
  id: number;

  title: string;

  children: HelpObject[];
}
