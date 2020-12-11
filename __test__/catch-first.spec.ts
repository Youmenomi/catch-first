import { Caught, safeAwait, safeCall, safeApply } from '../src';
import { checkType, delay, test1, test2 } from './helper';

class Foo {
  bar = { baz: 7 };
  f1(a: number, b: number) {
    return a + b + this.bar.baz;
  }
  f2() {
    throw 123;
  }
  async f3(a: number, b: number) {
    await delay(10);
    return this.f1(a, b);
  }
  async f4() {
    await delay(10);
    this.f2();
  }
}

describe('catch-first', () => {
  const foo = new Foo();
  it('safeCall', () => {
    const [caught, value] = safeCall(foo, foo.f1, 1, 2);
    expect(caught).toBe(null);
    expect(value).toBe(10);
  });
  it('safeCall catches', () => {
    const [caught, value] = safeCall(foo, foo.f2);
    expect(caught).toEqual(new Caught(123));
    expect(value).toBeUndefined();
  });
  it('safeApply', () => {
    const [caught, value] = safeApply(foo, foo.f1, [1, 2]);
    expect(caught).toBe(null);
    expect(value).toBe(10);
  });
  it('safeApply catches', () => {
    const [caught, value] = safeApply(foo, foo.f2);
    expect(caught).toEqual(new Caught(123));
    expect(value).toBeUndefined();
  });
  it('safeAwait', async () => {
    const [caught, value] = await safeAwait(foo.f3(1, 2));
    expect(caught).toBe(null);
    expect(value).toBe(10);
  });
  it('safeAwait catches', async () => {
    const [caught, value] = await safeAwait(foo.f4());
    expect(caught).toEqual(new Caught(123));
    expect(value).toBeUndefined();
  });

  it('type', async () => {
    const foo = new Foo();
    checkType<[Caught] | [null, Foo]>(safeCall(undefined, test1, foo));
    checkType<[Caught] | [null, Foo]>(safeApply(undefined, test1, [foo]));
    checkType<[Caught] | [null, Foo]>(await safeAwait(test2(foo)));
  });
});
