import test from 'ava';
import abortTimer, {TimeoutError} from './index.js';

test('returns an object with signal, reset, clear, and Symbol.dispose', t => {
	const timer = abortTimer(1000);
	t.truthy(timer.signal);
	t.is(typeof timer.reset, 'function');
	t.is(typeof timer.clear, 'function');
	t.is(typeof timer[Symbol.dispose], 'function');
	timer.clear();
});

test('signal is an AbortSignal', t => {
	const timer = abortTimer(1000);
	t.true(timer.signal instanceof AbortSignal);
	timer.clear();
});

test('signal is not aborted initially', t => {
	const timer = abortTimer(1000);
	t.false(timer.signal.aborted);
	timer.clear();
});

test('signal aborts after timeout', async t => {
	const timer = abortTimer(50);
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	t.true(timer.signal.aborted);
});

test('abort reason is a TimeoutError', async t => {
	const timer = abortTimer(50);
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	t.true(timer.signal.reason instanceof TimeoutError);
	t.is(timer.signal.reason.name, 'TimeoutError');
});

test('clear prevents abort', async t => {
	const timer = abortTimer(50);
	timer.clear();
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	t.false(timer.signal.aborted);
});

test('reset extends the deadline', async t => {
	const timer = abortTimer(50);
	timer.reset(200);
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	t.false(timer.signal.aborted);
	timer.clear();
});

test('reset without arguments uses original duration', async t => {
	const timer = abortTimer(200);
	timer.reset();
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	t.false(timer.signal.aborted);
	timer.clear();
});

test('Symbol.dispose calls clear', async t => {
	const timer = abortTimer(50);
	timer[Symbol.dispose]();
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	t.false(timer.signal.aborted);
});

test('throws TypeError for non-number input', t => {
	t.throws(() => abortTimer('100'), {instanceOf: TypeError});
});

test('throws TypeError for negative number', t => {
	t.throws(() => abortTimer(-1), {instanceOf: TypeError});
});

test('throws TypeError for zero', t => {
	t.throws(() => abortTimer(0), {instanceOf: TypeError});
});

test('throws TypeError for Infinity', t => {
	t.throws(() => abortTimer(Number.POSITIVE_INFINITY), {instanceOf: TypeError});
});

test('throws TypeError for NaN', t => {
	t.throws(() => abortTimer(Number.NaN), {instanceOf: TypeError});
});

test('TimeoutError has correct name', t => {
	const error = new TimeoutError();
	t.is(error.name, 'TimeoutError');
});

test('TimeoutError has default message', t => {
	const error = new TimeoutError();
	t.is(error.message, 'The operation was aborted due to timeout');
});

test('TimeoutError accepts custom message', t => {
	const error = new TimeoutError('custom');
	t.is(error.message, 'custom');
});

test('TimeoutError is an instance of Error', t => {
	const error = new TimeoutError();
	t.true(error instanceof Error);
});

test('reset with new duration changes the timeout', async t => {
	const timer = abortTimer(500);
	timer.reset(50);
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	t.true(timer.signal.aborted);
});
