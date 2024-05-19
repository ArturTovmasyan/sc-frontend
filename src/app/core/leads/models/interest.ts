import {Hobby} from './hobby';

export class Interest implements IdInterface {
  id: number;

  hobbies: Hobby[];
  notes: string;
}
