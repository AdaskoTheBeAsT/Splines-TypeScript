import { MonotoneCubicHermitInterpolation } from './monotone-cubic-hermite-interpolation';
import { NumberPair } from './number-pair';

describe('MonotoneCubicHermiteInterpolation', () => {
  describe('constructor', () => {
    it('should create interpolation from NumberPair array', () => {
      const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(1, 1), new NumberPair(2, 4)];

      const spline = new MonotoneCubicHermitInterpolation(values);

      expect(spline).toBeDefined();
    });

    it('should create interpolation from NumberTuple array', () => {
      const values: [number, number][] = [
        [0, 0],
        [1, 1],
        [2, 4],
      ];

      const spline = new MonotoneCubicHermitInterpolation(values);

      expect(spline).toBeDefined();
    });

    it('should handle unsorted input by sorting by x values', () => {
      const values: NumberPair[] = [new NumberPair(2, 4), new NumberPair(0, 0), new NumberPair(1, 1)];

      const spline = new MonotoneCubicHermitInterpolation(values);

      expect(spline.interpolate(0)).toBeCloseTo(0, 5);
      expect(spline.interpolate(2)).toBeCloseTo(4, 5);
    });
  });

  describe('interpolate', () => {
    describe('edge cases', () => {
      it('should throw for empty input (known limitation)', () => {
        const values: NumberPair[] = [];

        // Current implementation doesn't handle empty arrays gracefully
        expect(() => new MonotoneCubicHermitInterpolation(values)).toThrow();
      });

      it('should return the single y value for single point input', () => {
        const values: NumberPair[] = [new NumberPair(1, 5)];
        const spline = new MonotoneCubicHermitInterpolation(values);

        expect(spline.interpolate(0)).toBe(5);
        expect(spline.interpolate(1)).toBe(5);
        expect(spline.interpolate(10)).toBe(5);
      });

      it('should handle two points (linear interpolation)', () => {
        const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(2, 4)];
        const spline = new MonotoneCubicHermitInterpolation(values);

        expect(spline.interpolate(0)).toBeCloseTo(0, 5);
        expect(spline.interpolate(1)).toBeCloseTo(2, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
      });
    });

    describe('interpolation accuracy', () => {
      it('should pass through all data points', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 4),
          new NumberPair(3, 9),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        expect(spline.interpolate(0)).toBeCloseTo(0, 5);
        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);
      });

      it('should interpolate linear data correctly', () => {
        // y = 2x + 1
        const values: NumberPair[] = [
          new NumberPair(0, 1),
          new NumberPair(1, 3),
          new NumberPair(2, 5),
          new NumberPair(3, 7),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        expect(spline.interpolate(0.5)).toBeCloseTo(2, 5);
        expect(spline.interpolate(1.5)).toBeCloseTo(4, 5);
        expect(spline.interpolate(2.5)).toBeCloseTo(6, 5);
      });

      it('should interpolate monotonically increasing data', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 3),
          new NumberPair(3, 6),
          new NumberPair(4, 10),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        // Verify monotonicity - each subsequent value should be greater
        let prev = spline.interpolate(0);
        for (let x = 0.1; x <= 4; x += 0.1) {
          const current = spline.interpolate(x);
          expect(current).toBeGreaterThanOrEqual(prev - 1e-10); // Small tolerance for floating point
          prev = current;
        }
      });

      it('should interpolate monotonically decreasing data', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 10),
          new NumberPair(1, 6),
          new NumberPair(2, 3),
          new NumberPair(3, 1),
          new NumberPair(4, 0),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        // Verify monotonicity - each subsequent value should be smaller
        let prev = spline.interpolate(0);
        for (let x = 0.1; x <= 4; x += 0.1) {
          const current = spline.interpolate(x);
          expect(current).toBeLessThanOrEqual(prev + 1e-10); // Small tolerance for floating point
          prev = current;
        }
      });
    });

    describe('monotonicity preservation', () => {
      it('should preserve monotonicity with steep changes', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 0.1),
          new NumberPair(2, 0.9),
          new NumberPair(3, 1),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        // Check that interpolation doesn't overshoot
        for (let x = 0; x <= 3; x += 0.05) {
          const y = spline.interpolate(x);
          expect(y).toBeGreaterThanOrEqual(-0.01);
          expect(y).toBeLessThanOrEqual(1.01);
        }
      });

      it('should handle data with flat sections', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 1),
          new NumberPair(3, 2),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        // Should pass through known points
        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(1, 5);

        // In the flat section, values should be close to 1
        expect(spline.interpolate(1.5)).toBeCloseTo(1, 1);
      });

      it('should handle sign changes in slope (local extrema)', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 2),
          new NumberPair(2, 1),
          new NumberPair(3, 3),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        // Should pass through known points
        expect(spline.interpolate(0)).toBeCloseTo(0, 5);
        expect(spline.interpolate(1)).toBeCloseTo(2, 5);
        expect(spline.interpolate(2)).toBeCloseTo(1, 5);
        expect(spline.interpolate(3)).toBeCloseTo(3, 5);
      });
    });

    describe('boundary behavior', () => {
      it('should handle x value at left boundary', () => {
        const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(1, 1), new NumberPair(2, 4)];
        const spline = new MonotoneCubicHermitInterpolation(values);

        expect(spline.interpolate(0)).toBeCloseTo(0, 5);
      });

      it('should handle x value at right boundary', () => {
        const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(1, 1), new NumberPair(2, 4)];
        const spline = new MonotoneCubicHermitInterpolation(values);

        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
      });

      it('should return exact y value when x matches a data point', () => {
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(1, 1),
          new NumberPair(2, 4),
          new NumberPair(3, 9),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        // Binary search should find exact matches
        expect(spline.interpolate(0)).toBe(0);
        expect(spline.interpolate(1)).toBe(1);
        expect(spline.interpolate(2)).toBe(4);
        expect(spline.interpolate(3)).toBe(9);
      });
    });

    describe('with NumberTuple input', () => {
      it('should interpolate correctly with tuple input', () => {
        const values: [number, number][] = [
          [0, 0],
          [1, 1],
          [2, 4],
          [3, 9],
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        expect(spline.interpolate(0)).toBeCloseTo(0, 5);
        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);
      });
    });

    describe('extrapolation behavior', () => {
      it('should extrapolate beyond data range using cubic polynomial', () => {
        const values: NumberPair[] = [new NumberPair(0, 0), new NumberPair(1, 1), new NumberPair(2, 4)];
        const spline = new MonotoneCubicHermitInterpolation(values);

        // Extrapolation beyond right boundary
        const result = spline.interpolate(3);
        expect(typeof result).toBe('number');
        expect(Number.isNaN(result)).toBe(false);
      });
    });

    describe('parabola interpolation (y = x²)', () => {
      it('should show interpolation accuracy for 7 parabola points', () => {
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
        const spline = new MonotoneCubicHermitInterpolation(values);

        console.log('\nMonotone Cubic Hermite - Parabola y=x² (7 points):');
        console.log('x       | actual  | spline  | error');
        console.log('--------|---------|---------|--------');

        const testPoints = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];
        for (const x of testPoints) {
          const actual = x * x;
          const interpolated = spline.interpolate(x);
          const error = Math.abs(actual - interpolated);
          console.log(
            `${x.toFixed(1).padStart(7)} | ${actual.toFixed(4).padStart(7)} | ${interpolated.toFixed(4).padStart(7)} | ${error.toFixed(4)}`,
          );
        }

        // Verify exact points
        expect(spline.interpolate(-3)).toBeCloseTo(9, 5);
        expect(spline.interpolate(-2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(-1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(0)).toBeCloseTo(0, 5);
        expect(spline.interpolate(1)).toBeCloseTo(1, 5);
        expect(spline.interpolate(2)).toBeCloseTo(4, 5);
        expect(spline.interpolate(3)).toBeCloseTo(9, 5);

        // Interpolated points should be reasonably close
        expect(spline.interpolate(0.5)).toBeCloseTo(0.25, 0);
        expect(spline.interpolate(1.5)).toBeCloseTo(2.25, 0);
      });

      it('should work correctly with 9 points (finer granularity)', () => {
        // y = x² with 9 points from x = 0 to x = 4 (step 0.5)
        const values: NumberPair[] = [
          new NumberPair(0, 0),
          new NumberPair(0.5, 0.25),
          new NumberPair(1, 1),
          new NumberPair(1.5, 2.25),
          new NumberPair(2, 4),
          new NumberPair(2.5, 6.25),
          new NumberPair(3, 9),
          new NumberPair(3.5, 12.25),
          new NumberPair(4, 16),
        ];
        const spline = new MonotoneCubicHermitInterpolation(values);

        console.log('\nMonotone Cubic Hermite - Parabola y=x² (9 points, finer grid):');
        console.log('x       | actual  | spline  | error');
        console.log('--------|---------|---------|--------');

        // Test at quarter points (between the data points)
        const testPoints = [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75];
        for (const x of testPoints) {
          const actual = x * x;
          const interpolated = spline.interpolate(x);
          const error = Math.abs(actual - interpolated);
          console.log(
            `${x.toFixed(2).padStart(7)} | ${actual.toFixed(4).padStart(7)} | ${interpolated.toFixed(4).padStart(7)} | ${error.toFixed(4)}`,
          );
          // With finer grid, error should be smaller
          expect(error).toBeLessThan(0.05);
        }
      });

      it('should handle sine wave with 13 points', () => {
        // sin(x) from 0 to 2π with 13 points
        const values: NumberPair[] = [];
        for (let i = 0; i <= 12; i++) {
          const x = (i * Math.PI * 2) / 12;
          values.push(new NumberPair(x, Math.sin(x)));
        }
        const spline = new MonotoneCubicHermitInterpolation(values);

        console.log('\nMonotone Cubic Hermite - Sine wave (13 points):');
        console.log('x       | actual  | spline  | error');
        console.log('--------|---------|---------|--------');

        // Test at intermediate points
        for (let i = 0; i < 12; i++) {
          const x = ((i + 0.5) * Math.PI * 2) / 12;
          const actual = Math.sin(x);
          const interpolated = spline.interpolate(x);
          const error = Math.abs(actual - interpolated);
          console.log(
            `${x.toFixed(3).padStart(7)} | ${actual.toFixed(4).padStart(7)} | ${interpolated.toFixed(4).padStart(7)} | ${error.toFixed(4)}`,
          );
        }

        // Check that it passes through data points
        expect(spline.interpolate(0)).toBeCloseTo(0, 5);
        expect(spline.interpolate(Math.PI / 2)).toBeCloseTo(1, 1);
        expect(spline.interpolate(Math.PI)).toBeCloseTo(0, 1);
      });
    });
  });
});
