import { NgModule } from '@angular/core';
import { PostalCodeValidatorDirective } from './postalcode.validator';
import { RepeatPasswordValidatorDirective } from './repeatpassword.component';

@NgModule({
  imports: [],
  declarations: [PostalCodeValidatorDirective, RepeatPasswordValidatorDirective],
  exports: [PostalCodeValidatorDirective, RepeatPasswordValidatorDirective]
})
export class ValidatorsModule { }
