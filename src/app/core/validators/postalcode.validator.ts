import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidatorFn
} from '@angular/forms';
import {Directive, forwardRef,  Input} from '@angular/core';

export class CustomValidators {

  provinces: any[] = [];

  postalCode(provinces:any[]): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } | null =>
        provinces.find(province => control.value?.length <= 5 && province.prefijoCp == control.value?.slice(0,2) ) ? null : { wrongPostalCode: control.value};

  }

}


@Directive({
  selector: '[postalcode]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PostalCodeValidatorDirective),
      multi: true
  }]
})
export class PostalCodeValidatorDirective implements Validator {
  @Input('postalcode') provinces:any[] = [];

  constructor(){
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
      const validators = new CustomValidators();
      return validators.postalCode(this.provinces)(control);
  }
}



