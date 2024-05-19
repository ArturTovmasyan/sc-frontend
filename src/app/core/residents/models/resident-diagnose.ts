import {Diagnosis} from './diagnosis';
import {DiagnoseType} from './diagnose-type.enum';

export class ResidentDiagnose implements IdInterface {
  id: number;

  type: DiagnoseType;

  diagnosis: Diagnosis;

  notes: string;
}
