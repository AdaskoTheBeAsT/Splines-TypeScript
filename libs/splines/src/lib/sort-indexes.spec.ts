import { NumberPair, NumberTuple } from './number-pair';
import { sortNumberPairIndexes, sortNumberTupleIndexes } from './sort-indexes';

describe('sortIndexes', () => {
  describe('sortNumberPairIndexes', () => {
    it('should return indexes that sort pairs by x value ascending', () => {
      const values: NumberPair[] = [new NumberPair(3, 30), new NumberPair(1, 10), new NumberPair(2, 20)];

      const indexes = sortNumberPairIndexes(values);

      expect(indexes).toEqual([1, 2, 0]);
      // Verify sorting is correct
      expect(values[indexes[0]].x).toBe(1);
      expect(values[indexes[1]].x).toBe(2);
      expect(values[indexes[2]].x).toBe(3);
    });

    it('should return sequential indexes for already sorted data', () => {
      const values: NumberPair[] = [new NumberPair(1, 10), new NumberPair(2, 20), new NumberPair(3, 30)];

      const indexes = sortNumberPairIndexes(values);

      expect(indexes).toEqual([0, 1, 2]);
    });

    it('should handle reverse sorted data', () => {
      const values: NumberPair[] = [
        new NumberPair(5, 50),
        new NumberPair(4, 40),
        new NumberPair(3, 30),
        new NumberPair(2, 20),
        new NumberPair(1, 10),
      ];

      const indexes = sortNumberPairIndexes(values);

      expect(indexes).toEqual([4, 3, 2, 1, 0]);
    });

    it('should handle single element', () => {
      const values: NumberPair[] = [new NumberPair(5, 50)];

      const indexes = sortNumberPairIndexes(values);

      expect(indexes).toEqual([0]);
    });

    it('should handle empty array', () => {
      const values: NumberPair[] = [];

      const indexes = sortNumberPairIndexes(values);

      expect(indexes).toEqual([]);
    });

    it('should handle negative x values', () => {
      const values: NumberPair[] = [
        new NumberPair(0, 0),
        new NumberPair(-2, -20),
        new NumberPair(1, 10),
        new NumberPair(-1, -10),
      ];

      const indexes = sortNumberPairIndexes(values);

      expect(values[indexes[0]].x).toBe(-2);
      expect(values[indexes[1]].x).toBe(-1);
      expect(values[indexes[2]].x).toBe(0);
      expect(values[indexes[3]].x).toBe(1);
    });

    it('should handle floating point x values', () => {
      const values: NumberPair[] = [
        new NumberPair(1.5, 15),
        new NumberPair(1.1, 11),
        new NumberPair(1.9, 19),
        new NumberPair(1.3, 13),
      ];

      const indexes = sortNumberPairIndexes(values);

      expect(values[indexes[0]].x).toBe(1.1);
      expect(values[indexes[1]].x).toBe(1.3);
      expect(values[indexes[2]].x).toBe(1.5);
      expect(values[indexes[3]].x).toBe(1.9);
    });

    it('should maintain stable sort for equal x values', () => {
      const values: NumberPair[] = [new NumberPair(1, 10), new NumberPair(1, 20), new NumberPair(2, 30)];

      const indexes = sortNumberPairIndexes(values);

      // First two elements have same x, their relative order depends on sort stability
      expect(values[indexes[0]].x).toBe(1);
      expect(values[indexes[1]].x).toBe(1);
      expect(values[indexes[2]].x).toBe(2);
    });
  });

  describe('sortNumberTupleIndexes', () => {
    it('should return indexes that sort tuples by first element ascending', () => {
      const values: NumberTuple[] = [
        [3, 30],
        [1, 10],
        [2, 20],
      ];

      const indexes = sortNumberTupleIndexes(values);

      expect(indexes).toEqual([1, 2, 0]);
      // Verify sorting is correct
      expect(values[indexes[0]][0]).toBe(1);
      expect(values[indexes[1]][0]).toBe(2);
      expect(values[indexes[2]][0]).toBe(3);
    });

    it('should return sequential indexes for already sorted data', () => {
      const values: NumberTuple[] = [
        [1, 10],
        [2, 20],
        [3, 30],
      ];

      const indexes = sortNumberTupleIndexes(values);

      expect(indexes).toEqual([0, 1, 2]);
    });

    it('should handle reverse sorted data', () => {
      const values: NumberTuple[] = [
        [5, 50],
        [4, 40],
        [3, 30],
        [2, 20],
        [1, 10],
      ];

      const indexes = sortNumberTupleIndexes(values);

      expect(indexes).toEqual([4, 3, 2, 1, 0]);
    });

    it('should handle single element', () => {
      const values: NumberTuple[] = [[5, 50]];

      const indexes = sortNumberTupleIndexes(values);

      expect(indexes).toEqual([0]);
    });

    it('should handle empty array', () => {
      const values: NumberTuple[] = [];

      const indexes = sortNumberTupleIndexes(values);

      expect(indexes).toEqual([]);
    });

    it('should handle negative values', () => {
      const values: NumberTuple[] = [
        [0, 0],
        [-2, -20],
        [1, 10],
        [-1, -10],
      ];

      const indexes = sortNumberTupleIndexes(values);

      expect(values[indexes[0]][0]).toBe(-2);
      expect(values[indexes[1]][0]).toBe(-1);
      expect(values[indexes[2]][0]).toBe(0);
      expect(values[indexes[3]][0]).toBe(1);
    });

    it('should handle floating point values', () => {
      const values: NumberTuple[] = [
        [1.5, 15],
        [1.1, 11],
        [1.9, 19],
        [1.3, 13],
      ];

      const indexes = sortNumberTupleIndexes(values);

      expect(values[indexes[0]][0]).toBe(1.1);
      expect(values[indexes[1]][0]).toBe(1.3);
      expect(values[indexes[2]][0]).toBe(1.5);
      expect(values[indexes[3]][0]).toBe(1.9);
    });

    it('should maintain stable sort for equal first elements', () => {
      const values: NumberTuple[] = [
        [1, 10],
        [1, 20],
        [2, 30],
      ];

      const indexes = sortNumberTupleIndexes(values);

      // First two elements have same x, their relative order depends on sort stability
      expect(values[indexes[0]][0]).toBe(1);
      expect(values[indexes[1]][0]).toBe(1);
      expect(values[indexes[2]][0]).toBe(2);
    });
  });
});
