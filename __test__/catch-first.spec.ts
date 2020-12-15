import { CatchFirst, safeAwait, safeCall, safeApply } from '../src';
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
  it('safeCall done', () => {
    const result = safeCall(foo, foo.f1, 1, 2);
    expect(result.length).toBe(CatchFirst.done);
    if (result.length === CatchFirst.done) {
      const [caught, value] = result;
      expect(caught).toBe(null);
      expect(value).toBe(10);
    }
  });
  it('safeCall caught', () => {
    const result = safeCall(foo, foo.f2);
    expect(result.length).toBe(CatchFirst.caught);
    if (result.length === CatchFirst.caught) {
      const [caught] = result;
      expect(caught).toEqual(123);
    }
  });
  it('safeApply done', () => {
    const result = safeApply(foo, foo.f1, [1, 2]);
    expect(result.length).toBe(CatchFirst.done);
    if (result.length === CatchFirst.done) {
      const [caught, value] = result;
      expect(caught).toBe(null);
      expect(value).toBe(10);
    }
  });
  it('safeApply caught', () => {
    const result = safeApply(foo, foo.f2);
    expect(result.length).toBe(CatchFirst.caught);
    if (result.length === CatchFirst.caught) {
      const [caught] = result;
      expect(caught).toEqual(123);
    }
  });
  it('safeAwait done', async () => {
    {
      const result = await safeAwait(foo.f3(1, 2));
      expect(result.length).toBe(CatchFirst.done);
      if (result.length === CatchFirst.done) {
        const [caught, value] = result;
        expect(caught).toBe(null);
        expect(value).toBe(10);
      }
    }

    {
      //@ts-expect-error
      const result = await safeAwait('test');
      expect(result.length).toBe(CatchFirst.done);
      if (result.length === CatchFirst.done) {
        const [caught, value] = result;
        expect(caught).toBe(null);
        expect(value).toBe('test');
      }
    }
  });
  it('safeAwait caught', async () => {
    {
      const result = await safeAwait(foo.f4());
      expect(result.length).toBe(CatchFirst.caught);
      if (result.length === CatchFirst.caught) {
        const [caught] = result;
        expect(caught).toEqual(123);
      }
    }
  });

  it('type', async () => {
    const foo = new Foo();
    checkType<[unknown] | [null, Foo]>(safeCall(undefined, test1, foo));
    checkType<[unknown] | [null, Foo]>(safeApply(undefined, test1, [foo]));
    checkType<[unknown] | [null, Foo]>(await safeAwait(test2(foo)));
  });
});
