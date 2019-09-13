import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService,
              private http: HttpClient) {}

  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem("token");
    // проверяем не истек ли срок действия токена
    return !this.jwtHelper.isTokenExpired(token);
  }

  public login(req) {
    // let password = [];

    // for (let i = 0; i < req.password.length; i++) {
    //   password.push((req.password.charCodeAt(i)+123)*(i+2)+86574);
    // }

    // req.password = password;

    this.http.post(window.location.origin + "/app/auth/login", req).subscribe(value => {
      if (value['token']) {
        sessionStorage.setItem('token', value['token']);
      }
    })
  }
}
