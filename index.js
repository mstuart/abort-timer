export class TimeoutError extends Error {
  constructor(message) {
    super(message ?? "The operation was aborted due to timeout");
    this.name = "TimeoutError";
  }
}

export default function abortTimer(milliseconds) {
  const validateMilliseconds = (value) => {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      throw new TypeError(
        "Expected `milliseconds` to be a positive finite number"
      );
    }
  };

  validateMilliseconds(milliseconds);

  const controller = new AbortController();
  let timeoutMs = milliseconds;

  const startTimeout = (ms) => {
    const id = setTimeout(() => {
      controller.abort(new TimeoutError());
    }, ms);

    if (typeof id?.unref === "function") {
      id.unref();
    }

    return id;
  };

  let timeoutId = startTimeout(timeoutMs);

  const clear = () => {
    clearTimeout(timeoutId);
  };

  const reset = (ms) => {
    clear();
    if (ms !== undefined) {
      validateMilliseconds(ms);
      timeoutMs = ms;
    }

    timeoutId = startTimeout(timeoutMs);
  };

  return {
    clear,
    reset,
    signal: controller.signal,
    [Symbol.dispose]() {
      clear();
    },
  };
}
