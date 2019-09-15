import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AUTH_FORM_CONFIG } from '../../configs/auth-form.config'
import { IFormControl } from 'src/app/interfaces/form-control.intefaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _controls: Record<string, IFormControl> = AUTH_FORM_CONFIG.LOGIN_CONTROLS;
  private _authForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService
  ) { }

  private _initAuthForm(): void {
    this._authForm = this._formBuilder.group({});
    Object.keys(this._controls).forEach((key: string) => {
      let control: IFormControl = this._controls[key];
      this._authForm.addControl(control.name, this._formBuilder.control(null, Validators.compose(control.validators)))
    })
  }

  ngOnInit() {
    this._initAuthForm();
  }

  private _onSubmit(): void {
    this._authService.login(this._authForm.value);
  }

}
