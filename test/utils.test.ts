import { isEqual } from '../src/utils';

describe('utils', () => {
  it('isEqual', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual(1, NaN)).toBe(false);
    expect(isEqual([], [])).toBe(true);
    expect(isEqual([1, 2], [1, 2])).toBe(true);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isEqual([1, 2], [1, 3])).toBe(false);
    expect(isEqual({a: 1}, {a: 1})).toBe(true);
    expect(isEqual({a: 1}, {a: 2})).toBe(false);
    expect(isEqual({a: 1}, {a: 1, b: 1})).toBe(false);
    expect(isEqual({a: 1}, {b: 1})).toBe(false);
  });
});
