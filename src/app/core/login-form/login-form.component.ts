import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  authForm: FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService) {
  }

  ngOnInit() {
    this.authForm = this.fb.group({
      username: ['foprta'],
      password: ['kRu3ScCH9PSwgP']
    });
  }

  onSubmit() {
    this.auth.login(this.authForm.value)
    return false;
  }
}
