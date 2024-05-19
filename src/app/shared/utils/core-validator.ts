import * as _ from 'lodash';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {DateHelper} from '../helpers/date-helper';

export class CoreValidator {
  public static Patterns = {
    PASSWORD: /(\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*)/,
    DOSAGE: /^[0-9\.\-\/]+$/,
    DOSAGE_UNIT: /^[a-zA-Z0-9\%\+\/]+$/,

    FLOOR: /^[1-9][0-9]?$/,
    ROOM: /^[A-Za-z0-9]+$/,
    NUMBER_OF_FLOORS: /^[1-4]$/,

    PAYMENT_AMOUNT: /(^0$)|(^[1-9][0-9]*$)|(^[0-9]+(\.[0-9]{1,2})$)/,
    INSURANCE_NUMBER: /^[A-Za-z0-9]+$/,

    GROUP_CAPACITY: /^[1-9][0-9]*$/,
    CARE_GROUP: /^[1-9][0-9]*$/,
    STATE_ABBR: /^[A-Z]{2}$/,
    ZIP_MAIN: /^[0-9]{5}([- ]?[0-9]{4})?$/,
    PHONE: /^\([0-9]{3}\)\s?[0-9]{3}-[0-9]{4}$/,
    SSN: /^[\dX]{3}-?[\dX]{2}-?[\dX]{4}$/,

    KEY_FINANCE_DAY: /^([1-9]|[1]\d|2[0-8])$/,
    LATE_PAYMENT_DAY: /^([1-9][0-9]?|[12][0-9][0-9]|3[0-5][0-9]|36[0-5])$/,
  };

  public static password: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.PASSWORD,
    {
      pattern_validator_password: 'The password must be at least 8 characters long and ' +
        'contain at least one lowercase letter, ' +
        'one uppercase letter, ' +
        'one number and ' +
        'one special character (non-word characters).'
    }
  );
  public static ssn: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.SSN,
    {pattern_validator_ssn: 'Invalid format. Valid format is XXX-XX-XXXX.'}
  );
  public static phone: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.PHONE,
    {pattern_validator_phone: 'Invalid phone number format. Valid format is (XXX) XXX-XXXX.'}
  );
  public static dosage: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.DOSAGE,
    {pattern_validator_dosage: 'Try to add something like \'2, 0.5, 10/15, 0.4-4\'.'}
  );
  public static dosage_unit: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.DOSAGE_UNIT,
    {pattern_validator_dosage_unit: 'Available symbols are: \'%, +, /\'.'}
  );
  public static floor: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.FLOOR,
    {pattern_validator_floor: 'The value should be numeric and more than zero and no longer than 2 characters.'}
  );
  public static room: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.ROOM,
    {pattern_validator_room: 'The value should be alphanumeric.'}
  );
  public static insurance_number: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.INSURANCE_NUMBER,
    {pattern_validator_insurance_number: 'The value should be alphanumeric.'}
  );
  public static payment_amount: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.PAYMENT_AMOUNT,
    {pattern_validator_payment_amount: 'Try to add something like \'2000, 0.55, 100.34\'.'}
  );
  public static group_capacity: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.GROUP_CAPACITY,
    {pattern_validator_group_capacity: 'The value should be numeric and more than zero.'}
  );
  public static number_of_floors: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.NUMBER_OF_FLOORS,
    {pattern_validator_number_of_floors: 'The value should be 1/2/3/4.'}
  );
  public static care_group: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.CARE_GROUP,
    {pattern_validator_care_group: 'The value should be numeric and more than zero.'}
  );
  public static state_abbr: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.STATE_ABBR,
    {pattern_validator_state_abbr: 'Invalid abbreviation.'}
  );
  public static zip_main: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.ZIP_MAIN,
    {pattern_validator_zip_main: 'Invalid ZIP code.'}
  );
  public static key_finance_day: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.KEY_FINANCE_DAY,
    {pattern_validator_key_finance_day: 'The value should be in range 1-28.'}
  );
  public static late_payment_day: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.LATE_PAYMENT_DAY,
    {pattern_validator_late_payment_day: 'The value should be in range 1-365.'}
  );

  public static notNullOneOf(fields: string[], message: string) {
    return function (control: FormControl) {
      if (!control.parent) {
        return null;
      }

      const fg: FormGroup = control.parent as FormGroup;
      const fcs = fields.map(key => fg.contains(key) ? fg.get(key) : null);
      const isNull = fcs.every(fc => fc !== null ? fc.value === null : null);

      if (!isNull) {
        fcs.forEach(fc => {
          if (fc !== null && fc !== control && fc.value === null) {
            fc.updateValueAndValidity();
          }
        });
      }

      return !isNull ? null : {not_null_array: message};
    };
  }

  public static match_other(otherName: string, label: string) {
    let me: FormControl;
    let other: FormControl;

    return function matchOtherValidate(control: FormControl) {
      if (!control.parent) {
        return null;
      }

      if (!me) {
        me = control;
        other = control.parent.get(otherName) as FormControl;
        if (!other) {
          throw new Error('matchOtherValidator(): other control is not found in parent group');
        }
        other.valueChanges.subscribe(() => {
          if (me.value !== '') {
            me.updateValueAndValidity();
          }
        });
      }

      if (!other) {
        return null;
      }

      return other.value === me.value ? null : {pattern_validator_match_another: 'This value don\'t match with ' + label + '.'};
    };
  }

  public static notEmpty(control: AbstractControl): ValidationErrors | null {
    return !(
      CoreValidator.isEmptyInputValue(control.value) ||
      (_.isString(control.value) && CoreValidator.isEmptyInputValue(_.trim(control.value)))
    )
      ? null : {not_empty: 'This field is required.'};
  }

  public static lessThan(otherName: string): ValidatorFn {
    let me: FormControl;
    let other: FormControl;

    return (control: FormControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }

      if (!me) {
        me = control;
        other = control.parent.get(otherName) as FormControl;

        if (!other) {
          throw new Error('lessThan(): other control is not found in parent group');
        }

        other.valueChanges.subscribe(() => {
          me.updateValueAndValidity();
        });
      }

      if (!other) {
        return null;
      }

      return Number(me.value) >= Number(other.value) ? {'less_than': {value: other.value}} : null;
    };
  }

  public static greaterThan(otherName: string): ValidatorFn {
    let me: FormControl;
    let other: FormControl;

    return (control: FormControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }

      if (!me) {
        me = control;
        other = control.parent.get(otherName) as FormControl;

        if (!other) {
          throw new Error('greaterThan(): other control is not found in parent group');
        }

        other.valueChanges.subscribe(() => {
          me.updateValueAndValidity();
        });
      }

      if (!other) {
        return null;
      }

      return Number(me.value) <= Number(other.value) ? {'greater_than': {value: other.value}} : null;
    };
  }

  public static laterThan(otherName: string, datetime: boolean = true): ValidatorFn {
    let me: FormControl;
    let other: FormControl;

    return (control: FormControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }

      if (!me) {
        me = control;
        other = control.parent.get(otherName) as FormControl;

        if (!other) {
          throw new Error('laterThan(): other control is not found in parent group');
        }

        other.valueChanges.subscribe(() => {
          me.updateValueAndValidity();
        });
      }

      if (!other) {
        return null;
      }

      return !(me.value > other.value) ? {'later_than': {value: other.value, datetime: datetime}} : null;
    };
  }

  public static laterThanEqual(otherName: string, datetime: boolean = true): ValidatorFn {
    let me: FormControl;
    let other: FormControl;

    return (control: FormControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }

      if (!me) {
        me = control;
        other = control.parent.get(otherName) as FormControl;

        if (!other) {
          throw new Error('laterThan(): other control is not found in parent group');
        }

        other.valueChanges.subscribe(() => {
          me.updateValueAndValidity();
        });
      }

      if (!other) {
        return null;
      }

      return !(me.value >= other.value) ? {'later_than_equal': {value: other.value, datetime: datetime}} : null;
    };
  }

  public static earlierThan(otherName: string, datetime: boolean = true): ValidatorFn {
    let me: FormControl;
    let other: FormControl;

    return (control: FormControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }

      if (!me) {
        me = control;
        other = control.parent.get(otherName) as FormControl;

        if (!other) {
          throw new Error('earlierThan(): other control is not found in parent group');
        }

        other.valueChanges.subscribe(() => {
          me.updateValueAndValidity();
        });
      }

      if (!other) {
        return null;
      }

      return !(me.value < other.value) ? {'earlier_than': {value: other.value, datetime: datetime}} : null;
    };
  }

  public static earlierThanEqual(otherName: string, datetime: boolean = true): ValidatorFn {
    let me: FormControl;
    let other: FormControl;

    return (control: FormControl): { [key: string]: any } => {
      if (!control.parent) {
        return null;
      }

      if (!me) {
        me = control;
        other = control.parent.get(otherName) as FormControl;

        if (!other) {
          throw new Error('earlierThan(): other control is not found in parent group');
        }

        other.valueChanges.subscribe(() => {
          me.updateValueAndValidity();
        });
      }

      if (!other) {
        return null;
      }

      return !(me.value <= other.value) ? {'earlier_than_equal': {value: other.value, datetime: datetime}} : null;
    };
  }

  private static patternValidate(pattern: string | RegExp, error: ValidationErrors): ValidatorFn {
    if (!pattern) {
      return Validators.nullValidator;
    }

    let regex: RegExp;
    let regexStr: string;

    if (typeof pattern === 'string') {
      regexStr = '';

      if (pattern.charAt(0) !== '^') {
        regexStr += '^';
      }

      regexStr += pattern;

      if (pattern.charAt(pattern.length - 1) !== '$') {
        regexStr += '$';
      }

      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }

    return (control: AbstractControl): ValidationErrors | null => {
      if (CoreValidator.isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const value: string = control.value;
      return regex.test(value) ? null : error;
    };
  }

  private static isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
  }
}
