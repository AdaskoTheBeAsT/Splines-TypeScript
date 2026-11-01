import { NumberPair, NumberTuple, NumberValues } from './number-pair';
import { sortNumberPairIndexes, sortNumberTupleIndexes } from './sort-indexes';

export enum SplineErrorCode {
  EmptyInput = 'EMPTY_INPUT',
  InvalidFormat = 'INVALID_FORMAT',
  NonFinite = 'NON_FINITE',
  NonIncreasingX = 'NON_INCREASING_X',
}

export const SPLINE_ERROR_MESSAGES: Record<SplineErrorCode, string> = {
  [SplineErrorCode.EmptyInput]: 'Spline requires at least 1 point',
  [SplineErrorCode.InvalidFormat]: 'Invalid spline input format',
  [SplineErrorCode.NonFinite]: 'Spline points must be finite numbers',
  [SplineErrorCode.NonIncreasingX]:
    'Spline x values must be strictly increasing (duplicate x values are not supported)',
};

export class SplineInputError extends Error {
  public readonly code: SplineErrorCode;

  constructor(code: SplineErrorCode, message = SPLINE_ERROR_MESSAGES[code]) {
    super(message);
    this.name = 'SplineInputError';
    this.code = code;
  }
}

type NumberPairLike = { x: unknown; y: unknown };
type NumberTupleLike = unknown[];

function isNumberPairLike(v: unknown): v is NumberPairLike {
  return typeof v === 'object' && v !== null && 'x' in v && 'y' in v;
}

function isNumberTupleLike(v: unknown): v is NumberTupleLike {
  return Array.isArray(v) && v.length >= 2;
}

export function validateInput(values: unknown): asserts values is NumberValues {
  if (!Array.isArray(values)) {
    throw new SplineInputError(SplineErrorCode.InvalidFormat);
  }

  if (values.length === 0) {
    throw new SplineInputError(SplineErrorCode.EmptyInput);
  }

  const first = values[0];
  if (isNumberTupleLike(first)) {
    for (const item of values) {
      if (!isNumberTupleLike(item)) {
        throw new SplineInputError(SplineErrorCode.InvalidFormat);
      }
      if (typeof item[0] !== 'number' || typeof item[1] !== 'number') {
        throw new SplineInputError(SplineErrorCode.InvalidFormat);
      }
    }
    return;
  }

  if (isNumberPairLike(first)) {
    for (const item of values) {
      if (!isNumberPairLike(item)) {
        throw new SplineInputError(SplineErrorCode.InvalidFormat);
      }
      if (typeof (item as NumberPairLike).x !== 'number' || typeof (item as NumberPairLike).y !== 'number') {
        throw new SplineInputError(SplineErrorCode.InvalidFormat);
      }
    }
    return;
  }

  throw new SplineInputError(SplineErrorCode.InvalidFormat);
}

export function normalizeAndValidate(values: NumberValues): { xs: number[]; ys: number[] } {
  validateInput(values);

  const count = values.length;
  const xs = new Array<number>(count);
  const ys = new Array<number>(count);
  let isSorted = true;

  if (Array.isArray(values[0])) {
    const tuples = values as NumberTuple[];
    for (let i = 0; i < count; i++) {
      const tuple = tuples[i];
      const x = tuple[0];
      const y = tuple[1];
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new SplineInputError(SplineErrorCode.NonFinite);
      }
      if (i > 0 && x <= xs[i - 1]) {
        isSorted = false;
      }
      xs[i] = x;
      ys[i] = y;
    }

    if (isSorted) {
      return { xs, ys };
    }

    const indexes = sortNumberTupleIndexes(tuples);
    for (let i = 0; i < count; i++) {
      const tuple = tuples[indexes[i]];
      xs[i] = tuple[0];
      ys[i] = tuple[1];
      if (i > 0 && xs[i] <= xs[i - 1]) {
        throw new SplineInputError(SplineErrorCode.NonIncreasingX);
      }
    }

    return { xs, ys };
  }

  const pairs = values as NumberPair[];
  for (let i = 0; i < count; i++) {
    const pair = pairs[i];
    const x = pair.x;
    const y = pair.y;
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new SplineInputError(SplineErrorCode.NonFinite);
    }
    if (i > 0 && x <= xs[i - 1]) {
      isSorted = false;
    }
    xs[i] = x;
    ys[i] = y;
  }

  if (isSorted) {
    return { xs, ys };
  }

  const indexes = sortNumberPairIndexes(pairs);
  for (let i = 0; i < count; i++) {
    const pair = pairs[indexes[i]];
    xs[i] = pair.x;
    ys[i] = pair.y;
    if (i > 0 && xs[i] <= xs[i - 1]) {
      throw new SplineInputError(SplineErrorCode.NonIncreasingX);
    }
  }

  return { xs, ys };
}
