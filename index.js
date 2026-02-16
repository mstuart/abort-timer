export class TimeoutError extends Error {
	constructor(message) {
		super(message ?? 'The operation was aborted due to timeout');
		this.name = 'TimeoutError';
	}
}

export default function abortTimer(milliseconds) {
	if (typeof milliseconds !== 'number' || !Number.isFinite(milliseconds) || milliseconds <= 0) {
		throw new TypeError('Expected `milliseconds` to be a positive finite number');
	}

	const controller = new AbortController();
	let timeoutMs = milliseconds;

	const startTimeout = ms => {
		const id = setTimeout(() => {
			controller.abort(new TimeoutError());
		}, ms);

		if (typeof id?.unref === 'function') {
			id.unref();
		}

		return id;
	};

	let timeoutId = startTimeout(timeoutMs);

	const clear = () => {
		clearTimeout(timeoutId);
	};

	const reset = ms => {
		clear();
		if (ms !== undefined) {
			timeoutMs = ms;
		}

		timeoutId = startTimeout(timeoutMs);
	};

	return {
		signal: controller.signal,
		reset,
		clear,
		[Symbol.dispose]() {
			clear();
		},
	};
}
