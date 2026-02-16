# abort-timer

> Create an AbortSignal that aborts after a timeout, with reset and clear

## Install

```sh
npm install abort-timer
```

## Usage

```js
import abortTimer from 'abort-timer';

const {signal, clear} = abortTimer(5000);

const response = await fetch('https://example.com', {signal});
clear();
```

### Reset the timer

```js
import abortTimer from 'abort-timer';

const {signal, reset} = abortTimer(5000);

// Extend the deadline by another 5 seconds
reset();

// Or set a new duration
reset(10_000);
```

### Using `Symbol.dispose`

```js
import abortTimer from 'abort-timer';

{
	using timer = abortTimer(5000);
	await fetch('https://example.com', {signal: timer.signal});
}
// Timer is automatically cleared when leaving the block
```

## API

### abortTimer(milliseconds)

Returns an object with `signal`, `reset`, `clear`, and `Symbol.dispose`.

#### milliseconds

Type: `number`

The timeout duration in milliseconds. Must be a positive finite number.

### Return value

#### signal

Type: `AbortSignal`

The abort signal. Pass this to any API that accepts an `AbortSignal`.

#### reset(milliseconds?)

Reset the timer. Optionally provide a new duration in milliseconds. Defaults to the original duration.

#### clear()

Clear the timer without aborting the signal.

### TimeoutError

The error class used when the signal is aborted due to timeout. Has `name` set to `'TimeoutError'`.

## Related

- [is-runtime](https://github.com/mstuart/is-runtime) - Detect the current JavaScript runtime environment

## License

MIT
