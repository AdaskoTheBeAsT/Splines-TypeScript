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

import { NumberPair, NumberTuple } from './number-pair';

export const sortNumberPairIndexes = (values: NumberPair[]): number[] => {
  const indexes: number[] = [];
  for (let i = 0; i < values.length; i++) {
    indexes.push(i);
  }
  indexes.sort((a: number, b: number) => (values[a].x < values[b].x ? -1 : 1));
  return indexes;
};

export const sortNumberTupleIndexes = (values: NumberTuple[]): number[] => {
  const indexes: number[] = [];
  for (let i = 0; i < values.length; i++) {
    indexes.push(i);
  }
  indexes.sort((a: number, b: number) => (values[a][0] < values[b][0] ? -1 : 1));
  return indexes;
};
