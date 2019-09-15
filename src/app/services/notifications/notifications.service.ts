import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { INotification } from './interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor() { }

  public showError(notification: INotification) {
    console.log(notification.title, notification.message)
  }
}
