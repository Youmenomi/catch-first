export function delay(t: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

export function test1<T>(value: T) {
  return value;
}

export function test2<T>(value: T) {
  return new Promise<T>((resolve) => {
    resolve(value);
  });
}

export function checkType<T>(value: T) {
  value;
}
