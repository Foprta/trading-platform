import { Subject } from 'rxjs';

export interface ISubscription {
    subject$: Subject<any>,
    name: string,
    subscribers: number
}