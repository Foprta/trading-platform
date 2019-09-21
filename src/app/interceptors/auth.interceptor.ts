import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (request.url.indexOf('/secured')) {
            request = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)        
            })
        }
        return next.handle(request)
    }
}