import {expectType, expectError} from 'tsd';
import abortTimer, {type AbortTimer, TimeoutError} from './index.js';

const timer = abortTimer(1000);

expectType<AbortTimer>(timer);
expectType<AbortSignal>(timer.signal);
expectType<void>(timer.reset());
expectType<void>(timer.reset(2000));
expectType<void>(timer.clear());

const error = new TimeoutError();
expectType<TimeoutError>(error);
expectType<'TimeoutError'>(error.name);

expectError(abortTimer());
expectError(abortTimer('string'));
