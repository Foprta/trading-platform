import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take, delay, share, shareReplay, tap } from 'rxjs/operators';
import { IResponse } from './interfaces/response.interface';
import { Observable, Subject, } from 'rxjs';
import * as io from "socket.io-client";
import { URLS_CONFIG } from '../../configs/urls.config';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private _http: HttpClient) { }

  public post<T>(url: string, body?: any): Observable<IResponse<T>> {
    return this._http.post(url, body)
      .pipe(
        map((result: IResponse<T>) => result),
        take(1),
        delay(2000)
      );
  }

  public get<T>(url: string): Observable<IResponse<T>> {
    return this._http
      .get(`${url}`)
      .pipe(
        map((result: IResponse<T>) => result),
        shareReplay()
      );
  }

  public getSocket(): any {
    return io(URLS_CONFIG.SOCKET_SECURED_URL, {
      query: 'token=' + localStorage.getItem('access_token')
    });
  }
}