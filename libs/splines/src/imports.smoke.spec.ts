/* eslint-disable @nx/enforce-module-boundaries */
import {
  MonotoneCubicHermiteInterpolation,
  NaturalSpline,
  SplineErrorCode,
  SplineInputError,
  validateInput,
} from '@adaskothebeast/splines';
import { MonotoneCubicHermiteInterpolation as MonotoneFromSubpath } from '@adaskothebeast/splines/MonotoneCubicHermiteInterpolation';
import { NaturalSpline as NaturalFromSubpath } from '@adaskothebeast/splines/NaturalSpline';

describe('public entrypoints (smoke)', () => {
  it('should import from package root', () => {
    expect(typeof NaturalSpline).toBe('function');
    expect(typeof MonotoneCubicHermiteInterpolation).toBe('function');
    expect(typeof validateInput).toBe('function');
    expect(SplineErrorCode).toBeDefined();
    expect(SplineInputError).toBeDefined();
  });

  it('should import from subpath entrypoints', () => {
    expect(typeof NaturalFromSubpath).toBe('function');
    expect(typeof MonotoneFromSubpath).toBe('function');
  });

  it('should construct splines from imports', () => {
    const data: [number, number][] = [
      [0, 0],
      [1, 1],
      [2, 4],
    ];

    expect(new NaturalSpline(data).interpolate(1)).toBeCloseTo(1, 10);
    expect(new NaturalFromSubpath(data).interpolate(1)).toBeCloseTo(1, 10);
    expect(new MonotoneCubicHermiteInterpolation(data).interpolate(1)).toBeCloseTo(1, 10);
    expect(new MonotoneFromSubpath(data).interpolate(1)).toBeCloseTo(1, 10);
  });
});
