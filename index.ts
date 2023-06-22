import { take, map, combineAll } from 'rxjs/operators';
import { interval } from 'rxjs';

// emit every 1s, take 2
const source$ = interval(1000).pipe(
  map((i) => `First ${i}`),
  take(2)
);
// map each emitted value from source to interval observable that takes 5 values
const example$ = source$.pipe(
  map((val) =>
    interval(1000).pipe(
      map((i) => `Result (${val}): ${i}`),
      take(5)
    )
  )
);
/*
  2 values from source will map to 2 (inner) interval observables that emit every 1s.
  combineAll uses combineLatest strategy, emitting the last value from each
  whenever either observable emits a value
*/
example$
  .pipe(combineAll())
  /*
  output:
  ["Result (First 0): 0", "Result (First 1): 0"]
  ["Result (First 0): 1", "Result (First 1): 0"]
  ["Result (First 0): 1", "Result (First 1): 1"]
  ["Result (First 0): 2", "Result (First 1): 1"]
  ["Result (First 0): 2", "Result (First 1): 2"]
  ["Result (First 0): 3", "Result (First 1): 2"]
  ["Result (First 0): 3", "Result (First 1): 3"]
  ["Result (First 0): 4", "Result (First 1): 3"]
  ["Result (First 0): 4", "Result (First 1): 4"]
*/
  .subscribe(console.log);
