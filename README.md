# Splines

Splines implementation in TypeScript.

## Description from Wikipedia

In mathematics, a spline is a special function defined piecewise by polynomials. In interpolating problems, spline interpolation is often preferred to polynomial interpolation because it yields similar results, even when using low degree polynomials, while avoiding Runge's phenomenon for higher degrees.

## Types of algorithms

1. Monotone cubic Hermit interpolation [Reference](https://en.wikipedia.org/wiki/Monotone_cubic_interpolation)

In the mathematical field of numerical analysis, monotone cubic interpolation is a variant of cubic interpolation that preserves monotonicity of the data set being interpolated.

Monotonicity is preserved by linear interpolation but not guaranteed by cubic interpolation.

1. Natural Cubic Spline - [Reference](https://towardsdatascience.com/numerical-interpolation-natural-cubic-spline-52c1157b98ac)

It is a piece-wise cubic polynomial that is twice continuously differentiable. It is considerably ‘stiffer’ than a polynomial in the sense that it has less tendency to oscillate between data points.

## Installation

```sh
npm install @adaskothebeast/splines --save
```

```sh
yarn add @adaskothebeast/splines
```

## Usage

Initialize first with pairs of x and y numbers array.

```ts
const values: NumberPair[] = [new NumberPair(1, 5), new NumberPair(2, 6.5), ...];

//or
const values: NumberTuple[] = [[1, 5], [2, 6.5], ...];

const spline = new MonotoneCubicHermiteInterpolation(values);

const result = spline.interpolate(1.3);
```
