import {Medication} from './medication';

export class ResidentAllergyMedication implements IdInterface {
  id: number;

  medication: Medication;

  notes: string;
}
