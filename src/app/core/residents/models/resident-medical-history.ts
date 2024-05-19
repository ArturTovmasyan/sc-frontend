import {MedicalHistoryCondition} from './medical-history-condition';

export class ResidentMedicalHistory implements IdInterface {
  id: number;

  date_occured: Date;

  condition: MedicalHistoryCondition;

  notes: string;
}
