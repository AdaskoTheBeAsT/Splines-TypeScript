export type OutOfRangeStrategy = 'clamp' | 'extrapolate' | 'throw';

export interface SplineOptions {
  /**
   * Behavior when x is outside [minX, maxX].
   * - 'clamp' (default for NaturalSpline): return nearest endpoint y
   * - 'extrapolate' (default for MonotoneCubicHermiteInterpolation): evaluate boundary segment polynomial
   * - 'throw': throw a RangeError
   */
  outOfRange?: OutOfRangeStrategy;
}
