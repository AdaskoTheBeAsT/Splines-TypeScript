/**
 * Copyright (C) 2022 Adam Pluciński
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NumberValues } from './number-pair';
import { Spline } from './spline';
import { SplineBase } from './spline-base';
import { OutOfRangeStrategy, SplineOptions } from './spline-options';

export class NaturalSpline extends SplineBase implements Spline {
  private readonly a: Float64Array;
  private readonly h: Float64Array;
  private readonly outOfRange: OutOfRangeStrategy;

  constructor(values: NumberValues, options: SplineOptions = {}) {
    super(values);

    this.outOfRange = options.outOfRange ?? 'clamp';

    const xs = this.xs;
    const ys = this.ys;
    const length = xs.length;
    this.a = new Float64Array(length);
    this.h = new Float64Array(length);

    for (let i = 1; i < length; i++) {
      this.h[i] = xs[i] - xs[i - 1];
    }

    if (length <= 2) {
      return;
    }

    const sub = new Float64Array(length);
    const diag = new Float64Array(length);
    const sup = new Float64Array(length);

    for (let i = 1; i < length - 1; i++) {
      const hCurr = this.h[i];
      const hNext = this.h[i + 1];
      diag[i] = (hCurr + hNext) / 3.0;
      sup[i] = hNext / 6.0;
      sub[i] = hCurr / 6.0;
      this.a[i] = (ys[i + 1] - ys[i]) / hNext - (ys[i] - ys[i - 1]) / hCurr;
    }

    this.solve(sub, diag, sup, length - 2);
    this.a[length - 1] = 0.0;
  }

  private solve(sub: Float64Array, diag: Float64Array, sup: Float64Array, n: number): void {
    const a = this.a;
    for (let i = 2; i <= n; i++) {
      sub[i] = sub[i] / diag[i - 1];
      diag[i] = diag[i] - sub[i] * sup[i - 1];
      a[i] = a[i] - sub[i] * a[i - 1];
    }
    a[n] = a[n] / diag[n];
    for (let i = n - 1; i >= 1; i--) {
      a[i] = (a[i] - sup[i] * a[i + 1]) / diag[i];
    }
  }

  public interpolate(x: number): number {
    const xs = this.xs;
    const ys = this.ys;
    const length = xs.length;

    if (length === 0) {
      return 0;
    }

    if (length === 1) {
      return ys[0];
    }

    if (length === 2) {
      const x0 = xs[0];
      const y0 = ys[0];
      const x1 = xs[1];
      const y1 = ys[1];

      if (x <= x0) {
        if (this.outOfRange === 'throw' && x < x0) {
          throw new RangeError('x is out of range');
        }
        return this.outOfRange === 'extrapolate' ? y0 + (y1 - y0) * ((x - x0) / (x1 - x0)) : y0;
      }
      if (x >= x1) {
        if (this.outOfRange === 'throw' && x > x1) {
          throw new RangeError('x is out of range');
        }
        return this.outOfRange === 'extrapolate' ? y0 + (y1 - y0) * ((x - x0) / (x1 - x0)) : y1;
      }

      const t = (x - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }

    const leftX = xs[0];
    const rightX = xs[length - 1];
    const leftY = ys[0];
    const rightY = ys[length - 1];

    if (x < leftX) {
      if (this.outOfRange === 'throw') {
        throw new RangeError('x is out of range');
      }
      if (this.outOfRange === 'clamp') {
        return leftY;
      }
      return this.evaluateSegment(x, 1);
    }

    if (x > rightX) {
      if (this.outOfRange === 'throw') {
        throw new RangeError('x is out of range');
      }
      if (this.outOfRange === 'clamp') {
        return rightY;
      }
      return this.evaluateSegment(x, length - 1);
    }

    if (x === leftX) {
      return leftY;
    }
    if (x === rightX) {
      return rightY;
    }

    // Find the segment containing x using binary search
    let low = 0;
    let high = length - 1;
    while (high - low > 1) {
      const mid = (low + high) >>> 1;
      if (xs[mid] <= x) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return this.evaluateSegment(x, high);
  }

  private evaluateSegment(x: number, gap: number): number {
    const hGap = this.h[gap];
    const x1 = x - this.xs[gap - 1];
    const x2 = hGap - x1;

    return (
      (((-this.a[gap - 1] / 6.0) * (x2 + hGap) * x1 + this.ys[gap - 1]) * x2 +
        ((-this.a[gap] / 6.0) * (x1 + hGap) * x2 + this.ys[gap]) * x1) /
      hGap
    );
  }
}
