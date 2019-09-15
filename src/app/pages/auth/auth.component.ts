import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  public get isLoadingActive$(): Observable<boolean> {
    return this._authService.isLoadingActive$.asObservable();
  }

}
