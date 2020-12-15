export const CatchFirst = {
  caught: 1,
  done: 2,
} as const;

export function safeAwait<T>(promise: Promise<T>) {
  return Promise.resolve(promise)
    .then((data) => {
      return [null, data] as [null, T];
    })
    .catch((error) => {
      return [error] as [unknown];
    });
}

export function safeCall<T extends any[], R>(
  thisArg: unknown,
  value: (...args: T) => R,
  ...args: T
) {
  try {
    return [null, value.call(thisArg, ...args)] as [null, R];
  } catch (error) {
    return [error] as [unknown];
  }
}

export function safeApply<T extends any[], R>(
  thisArg: unknown,
  value: (...args: T) => R,
  args?: T
) {
  try {
    return [
      null,
      args === undefined ? value.apply(thisArg) : value.apply(thisArg, args),
    ] as [null, R];
  } catch (error) {
    return [error] as [unknown];
  }
}
