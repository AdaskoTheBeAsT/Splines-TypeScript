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

export type NumberValues = (NumberPair | NumberTuple)[];

export function isNumberPairArray(v: NumberValues): v is NumberPair[] {
  return (v[0] as NumberPair)?.x !== undefined;
}

export function isNumberTupleArray(v: NumberValues): v is NumberTuple[] {
  return (v[0] as [number, number])[0] !== undefined;
}
