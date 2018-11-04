import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class ValidationServiceProvider {

    constructor() {
        console.log('Hello ErrorHandlerProvider Provider')
    }

    // Validation for password and confirm password
    static MatchPassword(AC: AbstractControl) {
       const newPassword = AC.get('password').value // to get value in input tag
       const confirmPassword = AC.get('password2').value // to get value in input tag
        if(newPassword != confirmPassword) {
            console.log('false');
            AC.get('password2').setErrors( { MatchPassword: true } )
        } else {
            console.log('true')
            AC.get('password2').setErrors({ MatchPassword: false });
        }
    }
}