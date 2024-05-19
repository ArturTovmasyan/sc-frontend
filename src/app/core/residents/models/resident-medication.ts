import {Medication} from './medication';
import {Resident} from './resident';
import {MedicationFormFactor} from './medication-form-factor';
import {Physician} from './physician';

export class ResidentMedication implements IdInterface {
  id: number;

  dosage: string;
  dosage_unit: string;
  prescription_number: string;
  notes: string;

  am: string;
  nn: string;
  pm: string;
  hs: string;
  prn: boolean;
  discontinued: boolean;
  treatment: boolean;

  form_factor: MedicationFormFactor;
  medication: Medication;
  physician: Physician;
  resident: Resident;
}
