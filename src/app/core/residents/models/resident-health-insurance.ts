import {Resident} from './resident';
import {InsuranceCompany} from './insurance-company';

export class ResidentHealthInsurance implements IdInterface {
  id: number;

  medical_record_number: string;
  group_number: string;
  notes: string;

  company: InsuranceCompany;
  resident: Resident;
}
