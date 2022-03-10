import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidatorFn
} from '@angular/forms';
import {Directive} from '@angular/core';
import { provinciasService } from 'src/app/modules/users/provincias.service';

export class CustomValidators {

  provincesService: provinciasService;
  provinces: any[] = [];

  postalcode(provinces:any[]): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } | null =>
        provinces.find(province => control.value?.length <= 5 && province.prefijoCp == control.value?.slice(0,2) ) ? null : { wrongPostalCode: control.value};

  }

}

@Directive({
  selector: '[postalcode]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: PostalCodeValidatorDirective,
      multi: true
  }]
})
export class PostalCodeValidatorDirective implements Validator {

  provinces: any[] =[];
  constructor(private provincesService:provinciasService){
    this.provincesService.getProvincias().subscribe(provinces => {

      console.log(provinces)
      this.provinces = provinces
    });
  }

  validate(control: AbstractControl): { [key: string]: any } | null {

      const validators = new CustomValidators();

      return validators.postalcode(this.provinces)(control);
  }
}







