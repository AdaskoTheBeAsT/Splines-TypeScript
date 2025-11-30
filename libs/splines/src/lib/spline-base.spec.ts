import { MonotoneCubicHermiteInterpolation } from './monotone-cubic-hermite-interpolation';
import { NaturalSpline } from './natural-spline';
import { NumberPair, NumberTuple } from './number-pair';

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
});
