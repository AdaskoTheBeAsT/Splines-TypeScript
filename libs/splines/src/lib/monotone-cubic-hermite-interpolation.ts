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

export class MonotoneCubicHermitInterpolation extends SplineBase implements Spline {
  private c1s: number[];
  private c2s: number[];
  private c3s: number[];

  constructor(values: NumberValues) {
    super(values);

    this.c1s = [];
    this.c2s = [];
    this.c3s = [];

    const length = values.length;

    // Get consecutive differences and slopes
    const dxs: number[] = [];
    const ms: number[] = [];
    for (let i = 0; i < length - 1; i++) {
      const dx = this.xs[i + 1] - this.xs[i];
      const dy = this.ys[i + 1] - this.ys[i];
      dxs.push(dx);
      ms.push(dy / dx);
    }

    // Get degree-1 coefficients
    this.c1s.push(ms[0]);
    for (let i = 0; i < dxs.length - 1; i++) {
      const m = ms[i];
      const mNext = ms[i + 1];
      if (m * mNext <= 0) {
        this.c1s.push(0);
      } else {
        const dx1 = dxs[i];
        const dxNext = dxs[i + 1];
        const common = dx1 + dxNext;
        this.c1s.push((3 * common) / ((common + dxNext) / m + (common + dx1) / mNext));
      }
    }
    this.c1s.push(ms[ms.length - 1]);

    // Get degree-2 and degree-3 coefficients
    for (let i = 0; i < this.c1s.length - 1; i++) {
      const c1 = this.c1s[i];
      const m2 = ms[i];
      const invDx = 1 / dxs[i];
      const common2 = c1 + this.c1s[i + 1] - m2 - m2;
      this.c2s.push((m2 - c1 - common2) * invDx);
      this.c3s.push(common2 * invDx * invDx);
    }
  }

  interpolate(x: number): number {
    if (this.xs.length === 0) {
      return 0;
    }

    if (this.xs.length === 1) {
      return this.ys[0];
    }

    // The rightmost point in the dataset should give an exact result
    let i = this.xs.length - 1;
    if (x === this.xs[i]) {
      return this.ys[i];
    }

    // Search for the interval x is in, returning the corresponding y if x is one of the original xs
    let low = 0;
    let mid: number;
    let high = this.c3s.length - 1;
    while (low <= high) {
      mid = Math.floor(0.5 * (low + high));
      const xHere = this.xs[mid];
      if (xHere < x) {
        low = mid + 1;
      } else if (xHere > x) {
        high = mid - 1;
      } else {
        return this.ys[mid];
      }
    }
    i = Math.max(0, high);

    // Interpolate
    const diff = x - this.xs[i];
    const diffSq = diff * diff;
    return this.ys[i] + this.c1s[i] * diff + this.c2s[i] * diffSq + this.c3s[i] * diff * diffSq;
  }
}
