import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take, delay } from 'rxjs/operators';
import { IResponse } from './interfaces/response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private _http: HttpClient) { }

  public post<T>(url: string, body?: any): Observable<IResponse<T>> {
    return this._http.post(url, body)
      .pipe(
        map((result : IResponse<T>) => result),        
        take(1),
        delay(2000)
      );
  }
}
