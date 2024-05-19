import {Allergen} from './allergen';

export class ResidentAllergyOther implements IdInterface {
  id: number;

  allergen: Allergen;

  notes: string;
}
