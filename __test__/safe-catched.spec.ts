import { SafeCatched, safeAwait, safeCall, safeApply } from '../src';
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

describe('safe-catched', () => {
  const foo = new Foo();
  it('safeCall', () => {
    const [catched, value] = safeCall(foo, foo.f1, 1, 2);
    expect(catched).toBe(null);
    expect(value).toBe(10);
  });
  it('safeCall catches', () => {
    const [catched, value] = safeCall(foo, foo.f2);
    expect(catched).toEqual(new SafeCatched(123));
    expect(value).toBeUndefined();
  });
  it('safeApply', () => {
    const [catched, value] = safeApply(foo, foo.f1, [1, 2]);
    expect(catched).toBe(null);
    expect(value).toBe(10);
  });
  it('safeApply catches', () => {
    const [catched, value] = safeApply(foo, foo.f2);
    expect(catched).toEqual(new SafeCatched(123));
    expect(value).toBeUndefined();
  });
  it('safeAwait', async () => {
    const [catched, value] = await safeAwait(foo.f3(1, 2));
    expect(catched).toBe(null);
    expect(value).toBe(10);
  });
  it('safeAwait catches', async () => {
    const [catched, value] = await safeAwait(foo.f4());
    expect(catched).toEqual(new SafeCatched(123));
    expect(value).toBeUndefined();
  });

  it('type', async () => {
    const foo = new Foo();
    checkType<[SafeCatched] | [null, Foo]>(safeCall(undefined, test1, foo));
    checkType<[SafeCatched] | [null, Foo]>(safeApply(undefined, test1, [foo]));
    checkType<[SafeCatched] | [null, Foo]>(await safeAwait(test2(foo)));
  });
});
