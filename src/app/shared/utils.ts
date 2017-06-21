import { Observable } from 'rxjs';

type TimerCallback<T> = (tick: number) => T

export function resetTimer<T>(interval: number, callback: TimerCallback<T>): Observable<T> {
    return Observable.interval(interval).map(callback);
  }
