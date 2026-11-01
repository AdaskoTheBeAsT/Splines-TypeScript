import { MonotoneCubicHermiteInterpolation } from './monotone-cubic-hermite-interpolation';
import { NaturalSpline } from './natural-spline';
import { NumberPair, NumberTuple, NumberValues } from './number-pair';
import { SplineErrorCode, SplineInputError } from './input-validation';

// Since SplineBase is abstract, we test it through its concrete implementations
describe('SplineBase', () => {
  describe('data sorting on construction', () => {
    describe('via NaturalSpline', () => {
      it('should sort NumberPair input by x values', () => {
        // y = x² data, unsorted
        const values: NumberPair[] = [new NumberPair(3, 9), new NumberPair(1, 1), new NumberPair(2, 4)];
        const spline = new NaturalSpline(values);

        // The spline should work correctly after internal sorting
        // Natural spline approximates y=x², so at x=1.5, actual y=2.25
        // The spline should produce a value reasonably close to 2.25
        expect(spline.interpolate(1.5)).toBeCloseTo(2.25, 0);
        // Exact points should still be exact
        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);
      });

      it('should sort NumberTuple input by x values', () => {
        // y = x² data, unsorted
        const values: NumberTuple[] = [
          [3, 9],
          [1, 1],
          [2, 4],
        ];
        const spline = new NaturalSpline(values);

        // Natural spline approximates y=x², so at x=1.5, actual y=2.25
        expect(spline.interpolate(1.5)).toBeCloseTo(2.25, 0);
        // Exact points should still be exact
        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);
      });
    });

    describe('via MonotoneCubicHermiteInterpolation', () => {
      it('should sort NumberPair input by x values', () => {
        const values: NumberPair[] = [new NumberPair(3, 9), new NumberPair(1, 1), new NumberPair(2, 4)];
        const spline = new MonotoneCubicHermiteInterpolation(values);

        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);
      });

      it('should sort NumberTuple input by x values', () => {
        const values: NumberTuple[] = [
          [3, 9],
          [1, 1],
          [2, 4],
        ];
        const spline = new MonotoneCubicHermiteInterpolation(values);

        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);
      });
    });
  });

  describe('input format flexibility', () => {
    it('should produce same results from NumberPair and NumberTuple inputs', () => {
      const pairValues: NumberPair[] = [
        new NumberPair(0, 0),
        new NumberPair(1, 2),
        new NumberPair(2, 4),
        new NumberPair(3, 6),
      ];
      const tupleValues: NumberTuple[] = [
        [0, 0],
        [1, 2],
        [2, 4],
        [3, 6],
      ];

      const splineFromPairs = new MonotoneCubicHermiteInterpolation(pairValues);
      const splineFromTuples = new MonotoneCubicHermiteInterpolation(tupleValues);

      // Both should produce identical results
      for (let x = 0; x <= 3; x += 0.5) {
        expect(splineFromPairs.interpolate(x)).toBeCloseTo(splineFromTuples.interpolate(x), 10);
      }
    });
  });

  describe('input validation', () => {
    const constructors: Array<[string, (values: NumberValues) => unknown]> = [
      ['NaturalSpline', (values) => new NaturalSpline(values)],
      ['MonotoneCubicHermiteInterpolation', (values) => new MonotoneCubicHermiteInterpolation(values)],
    ];

    const expectInputError = (fn: () => unknown, code: SplineErrorCode) => {
      try {
        fn();
        throw new Error('Expected constructor to throw');
      } catch (e) {
        expect(e).toBeInstanceOf(SplineInputError);
        expect((e as SplineInputError).code).toBe(code);
      }
    };

    it.each(constructors)('%s: should throw for empty input', (_, create) => {
      expectInputError(() => create([]), SplineErrorCode.EmptyInput);
    });

    it.each(constructors)('%s: should throw for duplicate x values (NumberPair)', (_, create) => {
      const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(0, 1), new NumberPair(1, 2)];
      expectInputError(() => create(values), SplineErrorCode.NonIncreasingX);
    });

    it.each(constructors)('%s: should throw for duplicate x values (NumberTuple)', (_, create) => {
      const values: NumberTuple[] = [
        [0, 0],
        [0, 1],
        [1, 2],
      ];
      expectInputError(() => create(values), SplineErrorCode.NonIncreasingX);
    });

    it.each(constructors)('%s: should throw for non-finite numbers', (_, create) => {
      expectInputError(() => create([new NumberPair(NaN, 0), new NumberPair(1, 1)]), SplineErrorCode.NonFinite);
      expectInputError(() => create([new NumberPair(0, Infinity), new NumberPair(1, 1)]), SplineErrorCode.NonFinite);
      expectInputError(() => create([new NumberPair(0, 0), new NumberPair(1, NaN)]), SplineErrorCode.NonFinite);
    });

    it.each(constructors)('%s: should throw for invalid input formats', (_, create) => {
      const values = [{ foo: 1 }] as unknown as NumberValues;
      expectInputError(() => create(values), SplineErrorCode.InvalidFormat);
    });
  });
});
