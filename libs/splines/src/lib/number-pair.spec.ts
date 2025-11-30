import { NumberPair, NumberTuple, NumberValues, isNumberPairArray, isNumberTupleArray } from './number-pair';

describe('Simple types', () => {
  describe('NumberPair', () => {
    it('should create proper number pair', () => {
      const x = 1.5;
      const y = 2.7;

      const pair = new NumberPair(x, y);

      expect(pair.x).toBe(x);
      expect(pair.y).toBe(y);
    });
  });

  describe('NumberTuple', () => {
    it('should create proper number tuple', () => {
      const x = 3.14;
      const y = 2.71;

      const pair: NumberTuple = [x, y];

      expect(pair[0]).toBe(x);
      expect(pair[1]).toBe(y);
    });
  });

  describe('NumberValues', () => {
    it('should create proper number values from NumberPairs', () => {
      const x1 = 1;
      const y1 = 2;
      const x2 = 3;
      const y2 = 4;

      const values: NumberValues = [new NumberPair(x1, y1), new NumberPair(x2, y2)];

      expect(values[0].x).toBe(x1);
      expect(values[0].y).toBe(y1);
      expect(values[1].x).toBe(x2);
      expect(values[1].y).toBe(y2);
      expect(isNumberPairArray(values)).toBe(true);
      expect(isNumberTupleArray(values)).toBe(false);
    });

    it('should create proper number values from NumberTuples', () => {
      const x1 = 5;
      const y1 = 6;
      const x2 = 7;
      const y2 = 8;

      const values: NumberValues = [
        [x1, y1],
        [x2, y2],
      ];

      expect(values[0][0]).toBe(x1);
      expect(values[0][1]).toBe(y1);
      expect(values[1][0]).toBe(x2);
      expect(values[1][1]).toBe(y2);
      expect(isNumberPairArray(values)).toBe(false);
      expect(isNumberTupleArray(values)).toBe(true);
    });
  });
});
