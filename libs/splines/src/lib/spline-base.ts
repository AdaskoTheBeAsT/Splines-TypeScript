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

import { NumberValues, isNumberPairArray, isNumberTupleArray } from './number-pair';
import { sortNumberPairIndexes, sortNumberTupleIndexes } from './sort-indexes';

export abstract class SplineBase {
  protected xs: number[];
  protected ys: number[];

  constructor(values: NumberValues) {
    this.xs = [];
    this.ys = [];

    // Rearrange xs and ys so that xs is sorted
    if (isNumberPairArray(values)) {
      const indexes: number[] = sortNumberPairIndexes(values);
      for (let i = 0; i < values.length; i++) {
        this.xs.push(values[indexes[i]].x);
        this.ys.push(values[indexes[i]].y);
      }
    } else if (isNumberTupleArray(values)) {
      const indexes: number[] = sortNumberTupleIndexes(values);
      for (let i = 0; i < values.length; i++) {
        this.xs.push(values[indexes[i]][0]);
        this.ys.push(values[indexes[i]][1]);
      }
    }
  }
}
