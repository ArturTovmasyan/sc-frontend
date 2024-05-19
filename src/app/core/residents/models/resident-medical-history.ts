import {MedicalHistoryCondition} from './medical-history-condition';

export class ResidentMedicalHistory implements IdInterface {
  id: number;

  date: Date;

  condition: MedicalHistoryCondition;

  notes: string;
}
