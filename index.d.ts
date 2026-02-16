/**
Error thrown when the timer expires.
*/
export class TimeoutError extends Error {
	readonly name: 'TimeoutError';
}

export type AbortTimer = {
	/**
	The abort signal. Pass this to any API that accepts an `AbortSignal`.
	*/
	readonly signal: AbortSignal;

	/**
	Reset the timer. Optionally provide a new duration in milliseconds.

	@param milliseconds - New timeout duration. Defaults to the original duration.
	*/
	reset(milliseconds?: number): void;

	/**
	Clear the timer without aborting the signal.
	*/
	clear(): void;

	[Symbol.dispose](): void;
};

/**
Create an AbortSignal that aborts after a timeout, with reset and clear.

@param milliseconds - The timeout duration in milliseconds.
@returns An object with the abort signal, reset, and clear functions.

@example
```
import abortTimer from 'abort-timer';

const {signal, clear} = abortTimer(5000);

const response = await fetch('https://example.com', {signal});
clear();
```
*/
export default function abortTimer(milliseconds: number): AbortTimer;
