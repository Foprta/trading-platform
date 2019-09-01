import 'hammerjs';
import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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

