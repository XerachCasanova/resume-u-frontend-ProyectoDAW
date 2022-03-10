import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidatorFn
} from '@angular/forms';
import {Directive, forwardRef,  Input} from '@angular/core';

export class CustomValidators {

  repeatPassword(password:string): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } | null =>
       password === control.value ? null : { wrongRepeatPassword: control.value};

  }

}


@Directive({
  selector: '[repeatpassword]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RepeatPasswordValidatorDirective),
      multi: true
  }]
})
export class RepeatPasswordValidatorDirective implements Validator {
  @Input('repeatpassword') password:string

  constructor(){

  }

  validate(control: AbstractControl): { [key: string]: any } | null {


      const validators = new CustomValidators();

      return validators.repeatPassword(this.password)(control);
  }
}







