export class SafeCatched {
  constructor(public error: unknown) {}
}

export function safeAwait<T>(promise: Promise<T>) {
  return promise
    .then((data) => {
      return [null, data] as [null, T];
    })
    .catch((error) => {
      return [new SafeCatched(error)] as [SafeCatched];
    });
}

export function safeCall<T extends (...args: any[]) => any>(
  thisArg: unknown,
  value: T,
  ...args: Parameters<T>
) {
  try {
    return [null, value.call(thisArg, ...args)] as [null, ReturnType<T>];
  } catch (error) {
    return [new SafeCatched(error)] as [SafeCatched];
  }
}

export function safeApply<T extends (...args: any[]) => any>(
  thisArg: unknown,
  value: T,
  args?: Parameters<T>
) {
  try {
    return [
      null,
      args === undefined ? value.apply(thisArg) : value.apply(thisArg, args),
    ] as [null, ReturnType<T>];
  } catch (error) {
    return [new SafeCatched(error)] as [SafeCatched];
  }
}
