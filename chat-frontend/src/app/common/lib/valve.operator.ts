import { Observable, MonoTypeOperatorFunction } from 'rxjs';
import { withLatestFrom, filter, map } from 'rxjs/operators';

// reusable custom operator
export function valve<T>(bearer: Observable<boolean>): MonoTypeOperatorFunction<T> {
  return input$ => input$.pipe(
    withLatestFrom(bearer),
    filter(([inputValue, bearerValue]: [any, boolean]) => bearerValue),
    map(([inputValue, bearerValue]) => inputValue),
  );
}
