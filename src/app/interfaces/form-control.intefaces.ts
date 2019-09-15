import { ValidatorFn } from '@angular/forms';

export interface IFormControl {
    name: string,
    validators: ValidatorFn[],
}