import { Injectable } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IResponse } from '../backend/interfaces/response.interface';
import { INotification } from '../notifications/interfaces/notification.interface';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoadingActive$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _jwtHelper = new JwtHelperService();

  constructor(
    private _backend: BackendService,
    private _notifications: NotificationsService, 
    private _router: Router,
    ) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !this._jwtHelper.isTokenExpired(token);
  }

  public get isLoadingActive$(): BehaviorSubject<boolean> {
    return this._isLoadingActive$;
  }

  public login(user): void {
    this._isLoadingActive$.next(true);
    this._backend.post("http://localhost:3000/app/auth/login", user).subscribe(
      (data: IResponse<string>) => {
        localStorage.setItem('access_token', data.result);
        this._router.navigate(['trading']);
      },
      (error: HttpErrorResponse) => {
        const notification: INotification = {
          title: "ERROR",
          message: error.error.result
        }
        this._notifications.showError(notification);
        this._isLoadingActive$.next(false);
      },
      () => {
        this._isLoadingActive$.next(false);
      }
    )
  }
}