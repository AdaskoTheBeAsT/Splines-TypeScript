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

export class NumberPair {
  constructor(public x: number, public y: number) {}
}

export type NumberTuple = [number, number];

export type NumberValues = NumberPair[] | NumberTuple[];

export function isNumberPairArray(v: NumberValues): v is NumberPair[] {
  if (v.length === 0) {
    return false;
  }

  const first = v[0] as unknown as { x?: unknown; y?: unknown };
  return typeof first?.x === 'number' && typeof first?.y === 'number';
}

export function isNumberTupleArray(v: NumberValues): v is NumberTuple[] {
  if (v.length === 0) {
    return false;
  }

  const first = v[0] as unknown;
  return (
    Array.isArray(first) &&
    (first as unknown[]).length >= 2 &&
    typeof (first as unknown[])[0] === 'number' &&
    typeof (first as unknown[])[1] === 'number'
  );
}
