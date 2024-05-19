import {AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export class CoreValidator {
  public static Patterns = {
    PASSWORD: /(\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*)/,
    DOSAGE: /[0-9\.\-\/]+/,
    DOSAGE_UNIT: /[a-zA-Z0-9\%\+\/]+/,

    FLOOR: /(^[1-9][0-9]?$)/,

    PAYMENT_AMOUNT: /(^0$)|(^[1-9][0-9]*$)|(^[0-9]+(\.[0-9]{1,2})$)/,

    GROUP_CAPACITY: /(^[1-9][0-9]*$)/,
    CARE_GROUP: /(^[1-9][0-9]*$)/,
    STATE_ABBR: /\b([A-Z]{2})\b/,
    ZIP_MAIN: /^[0-9]{5}([- ]?[0-9]{4})?$/,
    PHONE: /^\([0-9]{3}\)\s?[0-9]{3}-[0-9]{4}$/,
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
  public static payment_amount: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.PAYMENT_AMOUNT,
    {pattern_validator_payment_amount: 'Try to add something like \'2000, 0.55, 100.34\'.'}
  );
  public static group_capacity: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.GROUP_CAPACITY,
    {pattern_validator_group_capacity: 'The value should be numeric and more than zero.'}
  );
  public static care_group: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.CARE_GROUP,
    {pattern_validator_group_capacity: 'The value should be numeric and more than zero.'}
  );
  public static state_abbr: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.STATE_ABBR,
    {pattern_validator_state_abbr: 'Invalid abbreviation.'}
  );
  public static zip_main: ValidatorFn = CoreValidator.patternValidate(
    CoreValidator.Patterns.ZIP_MAIN,
    {pattern_validator_zip_main: 'Invalid ZIP code.'}
  );

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
