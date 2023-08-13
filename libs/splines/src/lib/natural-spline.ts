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

export class NaturalSpline extends SplineBase implements Spline {
  private a: number[];
  private h: number[];

  constructor(values: NumberValues) {
    super(values);

    this.a = [];
    this.h = [];
    this.a[0] = 0.0;
    this.h[0] = 0.0;
    const length: number = values.length;

    for (let i = 1; i < length; i++) {
      this.h[i] = this.xs[i] - this.xs[i - 1];
    }

    if (length <= 2) {
      return;
    }

    const sub: number[] = [];
    const diag: number[] = [];
    const sup: number[] = [];
    sub[0] = 0.0;
    diag[0] = 0.0;
    sub[0] = 0.0;
    for (let i = 1; i < length - 1; i++) {
      diag[i] = (this.h[i] + this.h[i + 1]) / 3.0;
      sup[i] = this.h[i + 1] / 6.0;
      sub[i] = this.h[i] / 6.0;
      this.a[i] = (this.xs[i + 1] - this.xs[i]) / this.h[i + 1] - (this.xs[i] - this.xs[i - 1]) / this.h[i];
    }
    this.solve(sub, diag, sup, length - 2);
  }

  private solve(sub: number[], diag: number[], sup: number[], n: number) {
    for (let i = 2; i < n; i++) {
      sub[i] = sub[i] / diag[i - 1];
      diag[i] = diag[i] - sub[i] * sup[i - 1];
      this.a[i] = this.a[i] - sub[i] * this.a[i - 1];
    }
    this.a[n] = this.a[n] / diag[n];
    for (let i = n - 1; i >= 1; i--) {
      this.a[i] = (this.a[i] - sup[i] * this.a[i + 1]) / diag[i];
    }
  }

  public interpolate(x: number): number {
    if (this.xs.length === 0) {
      return 0;
    }

    if (this.xs.length === 1) {
      return this.ys[0];
    }

    let gap = 0;
    let previous = 0.0;
    for (let i = 0; i < this.xs.length; i++) {
      if (previous < this.xs[i] && this.xs[i] < x) {
        previous = this.xs[i];
        gap = i + 1;
      }
    }
    const x1: number = x - previous;
    const x2: number = this.h[gap] - x1;
    if (gap === 0) {
      return this.ys[0];
    }
    return (
      (((-this.a[gap - 1] / 6.0) * (x2 + this.h[gap]) * x1 + this.ys[gap - 1]) * x2 +
        ((-this.a[gap] / 6.0) * (x1 + this.h[gap]) * x2 + this.ys[gap]) * x1) /
      this.h[gap]
    );
  }
}
