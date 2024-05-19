import { FormControl } from '@angular/forms';

export class ValidationService {
    /**
     * @param validatorName
     * @param validatorValue
     */
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        const config = {
            'required': 'Required',
            'invalidEmailAddress': 'Invalid email address',
            'currentPassword': 'Invalid current password',
            'invalidPhone': 'Invalid phone number',
            'invalidNumber': 'Must be number',
            'addEmail': 'This email already exists',
            'invalidPassword': 'Invalid password. Password must be at least 8 characters long, and contain a number and symbol.',
            'minlength': `Minimum length ${validatorValue ? validatorValue.requiredLength : 0}`,
            'invalidConfirmPassword': 'Passwords do not match, please retype',
            'invalidUsedPassword': 'This password equal to current user password',
            'invalidIp': 'Invalid IP address',
        };

        return config[validatorName];
    }

    /**
     * @param control
     */
    static emailValidator(control) {
        if (control.value &&
            control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        }

        return {'invalidEmailAddress': true};
    }

    /**
     * @param control
     */
    static passwordValidator(control) {
        if (control.value && control.value.match(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[`~!@#$%^&*_\-+=|\/?<>])([a-zA-Z0-9`~!@#$%^&*_\-+=|\/?<>]{8,16})$/)) {
            return null;
        }

        return {'invalidPassword': true};
    }

    /**
     * @param control
     */
    static phoneValidator(control) {
        if (control.value && control.value.match
            (/(\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$)/)
        ) {
            return null;
        }

        return {'invalidPhone': true};
    }

    /**
     * @param control
     */
    static numberValidator(control) {
        if (control.value && control.value.toString().match(/(^[0-9][0-9]*$)/)) {
            return null;
        }

        return {'invalidNumber': true};
    }

    /**
     * @param control
     */
    static ipValidator(control) {
        if (control.value && control.value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)) {
            return null;
        } else if (control.value && control.value.length > 0) {
            return {'invalidIp': true};
        }
    }

    /**
     * function for checking plain password validation
     * @param c
     */
    static passwordsEqualValidator(c: FormControl) {
        if (c.value.newPassword.length > 0 &&
            (c.value.confirmPassword.length > 0 && c.value.newPassword !== c.value.confirmPassword)
        ) {
            return {'invalidConfirmPassword': true};
        }

        return null;
    }
}
