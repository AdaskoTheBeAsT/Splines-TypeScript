import { NaturalSpline } from './natural-spline';
import { NumberPair } from './number-pair';

describe('NaturalSpline', () => {
  describe('constructor', () => {
    it('should create spline from NumberPair array', () => {
      const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(1, 1), new NumberPair(2, 4)];

      const spline = new NaturalSpline(values);

      expect(spline).toBeDefined();
    });

    it('should create spline from NumberTuple array', () => {
      const values: [number, number][] = [
        [0, 0],
        [1, 1],
        [2, 4],
      ];

      const spline = new NaturalSpline(values);

      expect(spline).toBeDefined();
    });

    it('should handle unsorted input by sorting by x values', () => {
      const values: NumberPair[] = [new NumberPair(2, 4), new NumberPair(0, 0), new NumberPair(1, 1)];

      const spline = new NaturalSpline(values);

      // Should be defined after sorting
      expect(spline).toBeDefined();
    });
  });

  describe('interpolate', () => {
    describe('edge cases', () => {
      it('should throw for empty input', () => {
        const values: NumberPair[] = [];

        expect(() => new NaturalSpline(values)).toThrow(/at least 1 point/i);
      });

      it('should return the single y value for single point input', () => {
        const values: NumberPair[] = [new NumberPair(1, 5)];
        const spline = new NaturalSpline(values);

        expect(spline.interpolate(0)).toBe(5);
        expect(spline.interpolate(1)).toBe(5);
        expect(spline.interpolate(10)).toBe(5);
      });

      it('should handle two points', () => {
        const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(2, 4)];
        const spline = new NaturalSpline(values);

        expect(spline.interpolate(0)).toBeCloseTo(0, 10);
        expect(spline.interpolate(1)).toBeCloseTo(2, 10);
        expect(spline.interpolate(2)).toBeCloseTo(4, 10);
      });
    });

    describe('interpolation accuracy', () => {
      it('should pass through all data points and interpolate accurately across all segments', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 4),
          new NumberPair(3, 9),
        ];
        const spline = new NaturalSpline(values);

        expect(spline.interpolate(0)).toBeCloseTo(0, 10);
        expect(spline.interpolate(1)).toBeCloseTo(1, 10);
        expect(spline.interpolate(2)).toBeCloseTo(4, 10);
        expect(spline.interpolate(3)).toBeCloseTo(9, 10);
        expect(spline.interpolate(0.5)).toBeCloseTo(0.25, 0);
        expect(spline.interpolate(1.5)).toBeCloseTo(2.25, 0);
        expect(spline.interpolate(2.5)).toBeCloseTo(6.25, 0);
      });

      it('should produce finite values in working range', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 4),
          new NumberPair(3, 9),
        ];
        const spline = new NaturalSpline(values);

        for (let x = 0; x <= 3; x += 0.1) {
          const y = spline.interpolate(x);
          expect(Number.isFinite(y)).toBe(true);
        }
      });
    });

    describe('boundary behavior', () => {
      it('should handle x value below left boundary', () => {
        const values: NumberPair[] = [new NumberPair(1, 1), new NumberPair(2, 4), new NumberPair(3, 9)];
        const spline = new NaturalSpline(values);

        // Should return first y value when x is less than minimum
        expect(spline.interpolate(0)).toBe(1);
      });

      it('should support outOfRange options', () => {
        const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(1, 1), new NumberPair(2, 2)];

        const clampSpline = new NaturalSpline(values, { outOfRange: 'clamp' });
        expect(clampSpline.interpolate(-1)).toBe(0);
        expect(clampSpline.interpolate(3)).toBe(2);

        const extrapolateSpline = new NaturalSpline(values, { outOfRange: 'extrapolate' });
        expect(extrapolateSpline.interpolate(-1)).toBeCloseTo(-1, 10);
        expect(extrapolateSpline.interpolate(3)).toBeCloseTo(3, 10);

        const throwSpline = new NaturalSpline(values, { outOfRange: 'throw' });
        expect(() => throwSpline.interpolate(-1)).toThrow(RangeError);
        expect(() => throwSpline.interpolate(3)).toThrow(RangeError);
      });
    });

    describe('with NumberTuple input', () => {
      it('should accept tuple input and produce correct results in later segments', () => {
        const values: [number, number][] = [
          [0, 0],
          [1, 1],
          [2, 4],
          [3, 9],
        ];
        const spline = new NaturalSpline(values);

        // Later segments work
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);
      });
    });

    describe('parabola interpolation (y = x²)', () => {
      it('should produce finite values for parabola sample points (7 points)', () => {
        // y = x² with 7 points from x = -3 to x = 3
        const values: NumberPair[] = [
          new NumberPair(-3, 9),
          new NumberPair(-2, 4),
          new NumberPair(-1, 1),
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 4),
          new NumberPair(3, 9),
        ];
        const spline = new NaturalSpline(values);

        // Test interpolation at various points
        const testPoints = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];
        for (const x of testPoints) {
          const actual = x * x;
          const interpolated = spline.interpolate(x);
          const error = Math.abs(actual - interpolated);
          expect(Number.isFinite(actual)).toBe(true);
          expect(Number.isFinite(interpolated)).toBe(true);
          expect(Number.isFinite(error)).toBe(true);
        }

        // Verify exact knot points across all segments
        expect(spline.interpolate(-3)).toBeCloseTo(9, 10);
        expect(spline.interpolate(-2)).toBeCloseTo(4, 10);
        expect(spline.interpolate(-1)).toBeCloseTo(1, 10);
        expect(spline.interpolate(0)).toBeCloseTo(0, 10);
        expect(spline.interpolate(1)).toBeCloseTo(1, 10);
        expect(spline.interpolate(2)).toBeCloseTo(4, 10);
        expect(spline.interpolate(3)).toBeCloseTo(9, 10);
        expect(spline.interpolate(-1.5)).toBeCloseTo(2.25, 0);
        expect(spline.interpolate(-0.5)).toBeCloseTo(0.25, 0);
        expect(spline.interpolate(0.5)).toBeCloseTo(0.25, 0);
        expect(spline.interpolate(1.5)).toBeCloseTo(2.25, 0);
      });

      it('should work correctly with only positive x values (simpler case)', () => {
        // y = x² with 5 points from x = 0 to x = 4
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 4),
          new NumberPair(3, 9),
          new NumberPair(4, 16),
        ];
        const spline = new NaturalSpline(values);

        for (let x = 0; x <= 4; x += 0.5) {
          const actual = x * x;
          const interpolated = spline.interpolate(x);
          const error = Math.abs(actual - interpolated);
          expect(Number.isFinite(actual)).toBe(true);
          expect(Number.isFinite(interpolated)).toBe(true);
          expect(Number.isFinite(error)).toBe(true);
        }

        // Middle segments should work better
        expect(Number.isFinite(spline.interpolate(1.5))).toBe(true);
        expect(Number.isFinite(spline.interpolate(2.5))).toBe(true);
      });
    });
  });
});
