import { IFormControl } from 'src/app/interfaces/form-control.intefaces';
import { Validators } from '@angular/forms';

export class AUTH_FORM_CONFIG {
    static get LOGIN_CONTROLS(): Record<string, IFormControl> {
        return {
            LOGIN: {
                name: "username",
                validators: [Validators.required]
            },
            PASSWORD: {
                name: 'password',
                validators: [Validators.required]
            }
        }
    }
}