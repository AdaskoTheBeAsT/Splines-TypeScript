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

export class MonotoneCubicHermiteInterpolation extends SplineBase implements Spline {
  private readonly c1s: Float64Array;
  private readonly c2s: Float64Array;
  private readonly c3s: Float64Array;
  private readonly outOfRange: OutOfRangeStrategy;

  constructor(values: NumberValues, options: SplineOptions = {}) {
    super(values);

    this.outOfRange = options.outOfRange ?? 'extrapolate';

    const xs = this.xs;
    const ys = this.ys;
    const length = xs.length;

    if (length <= 1) {
      this.c1s = new Float64Array(0);
      this.c2s = new Float64Array(0);
      this.c3s = new Float64Array(0);
      return;
    }

    const segmentCount = length - 1;
    const dxs = new Float64Array(segmentCount);
    const ms = new Float64Array(segmentCount);
    for (let i = 0; i < segmentCount; i++) {
      const dx = xs[i + 1] - xs[i];
      const dy = ys[i + 1] - ys[i];
      dxs[i] = dx;
      ms[i] = dy / dx;
    }

    // Get degree-1 coefficients
    const c1s = new Float64Array(length);
    c1s[0] = ms[0];
    for (let i = 0; i < segmentCount - 1; i++) {
      const m = ms[i];
      const mNext = ms[i + 1];
      if (m * mNext <= 0) {
        c1s[i + 1] = 0;
      } else {
        const dx1 = dxs[i];
        const dxNext = dxs[i + 1];
        const common = dx1 + dxNext;
        c1s[i + 1] = (3 * common) / ((common + dxNext) / m + (common + dx1) / mNext);
      }
    }
    c1s[length - 1] = ms[segmentCount - 1];

    // Get degree-2 and degree-3 coefficients
    const c2s = new Float64Array(segmentCount);
    const c3s = new Float64Array(segmentCount);
    for (let i = 0; i < segmentCount; i++) {
      const c1 = c1s[i];
      const m2 = ms[i];
      const invDx = 1 / dxs[i];
      const common2 = c1 + c1s[i + 1] - m2 - m2;
      c2s[i] = (m2 - c1 - common2) * invDx;
      c3s[i] = common2 * invDx * invDx;
    }

    this.c1s = c1s;
    this.c2s = c2s;
    this.c3s = c3s;
  }

  interpolate(x: number): number {
    const xs = this.xs;
    const ys = this.ys;
    const length = xs.length;

    if (length === 0) {
      return 0;
    }

    if (length === 1) {
      return ys[0];
    }

    const leftX = xs[0];
    const rightX = xs[length - 1];
    if (x < leftX) {
      if (this.outOfRange === 'throw') {
        throw new RangeError('x is out of range');
      }
      if (this.outOfRange === 'clamp') {
        return ys[0];
      }
    }
    if (x > rightX) {
      if (this.outOfRange === 'throw') {
        throw new RangeError('x is out of range');
      }
      if (this.outOfRange === 'clamp') {
        return ys[length - 1];
      }
    }

    // The rightmost point in the dataset should give an exact result
    let i = length - 1;
    if (x === xs[i]) {
      return ys[i];
    }

    // Search for the interval x is in, returning the corresponding y if x is one of the original xs
    let low = 0;
    let high = this.c3s.length - 1;
    while (low <= high) {
      const mid = (low + high) >>> 1;
      const xHere = xs[mid];
      if (xHere < x) {
        low = mid + 1;
      } else if (xHere > x) {
        high = mid - 1;
      } else {
        return ys[mid];
      }
    }
    i = high > 0 ? high : 0;

    // Interpolate
    const diff = x - xs[i];
    const diffSq = diff * diff;
    return ys[i] + this.c1s[i] * diff + this.c2s[i] * diffSq + this.c3s[i] * diff * diffSq;
  }
}
