import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CoreValidator {
  public static Patterns = {
    PASSWORD: /(\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])(?=\S*[\W])\S*)/,
    DOSAGE: /[0-9\.\-\/]+/,
    DOSAGE_UNIT: /[a-zA-Z0-9\%\+\/]+/,

    FLOOR: /(^[1-9][0-9]*$)/,

    PAYMENT_AMOUNT: /(^0$)|(^[1-9][0-9]*$)|(^[0-9]+(\.[0-9]{1,2})$)/,

    GROUP_CAPACITY: /(^[1-9][0-9]*$)/,
    STATE_ABBR: /\b([A-Z]{2})\b/,
    ZIP_MAIN: /^[0-9]{5}([- ]?[0-9]{4})?$/,
    PHONE: /(\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$)/,
  };

  public static password: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.PASSWORD, {pattern_validator_password: 'The password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character (non-word characters).'});
  public static phone: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.PHONE, {pattern_validator_phone: ''});
  public static dosage: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.DOSAGE, {pattern_validator_dosage: ''});
  public static dosage_unit: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.DOSAGE_UNIT, {pattern_validator_dosage_unit: ''});
  public static floor: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.FLOOR, {pattern_validator_floor: ''});
  public static payment_amount: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.PAYMENT_AMOUNT, {pattern_validator_payment_amount: ''});
  public static group_capacity: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.GROUP_CAPACITY, {pattern_validator_group_capacity: ''});
  public static state_abbr: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.STATE_ABBR, {pattern_validator_state_abbr: ''});
  public static zip_main: ValidatorFn = CoreValidator.patternValidate(CoreValidator.Patterns.ZIP_MAIN, {pattern_validator_zip_main: ''});

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

  private static patternValidate(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }
}
