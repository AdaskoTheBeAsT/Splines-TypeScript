# 📈 Splines

[![npm version](https://img.shields.io/npm/v/@adaskothebeast/splines.svg)](https://www.npmjs.com/package/@adaskothebeast/splines)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**Lightweight, zero-dependency spline interpolation for TypeScript and JavaScript.**

Smooth curves through your data points — no PhD required.

---

## 🤔 Why?

Ever needed to:

- **Smooth out sensor data** without losing the trend?
- **Animate between keyframes** with natural-looking motion?
- **Fill gaps in time series** data intelligently?
- **Create smooth charts** from sparse data points?
- **Interpolate colors, positions, or any numeric values** smoothly?

Linear interpolation looks robotic. Polynomial interpolation oscillates wildly ([Runge's phenomenon](https://en.wikipedia.org/wiki/Runge%27s_phenomenon)). **Splines give you the best of both worlds** — smooth curves that actually pass through your data points.

This library gives you production-ready spline interpolation in ~3KB (minified), with:

- ✅ **Zero dependencies** — just math
- ✅ **TypeScript-first** — full type safety
- ✅ **Two algorithms** — pick the right tool for your data
- ✅ **Tree-shakeable** — only bundle what you use
- ✅ **Well-tested** — comprehensive test suite

---

## 📦 Installation

```bash
npm install @adaskothebeast/splines
```

```bash
yarn add @adaskothebeast/splines
```

```bash
pnpm add @adaskothebeast/splines
```

---

## 🚀 Quick Start

```typescript
import { MonotoneCubicHermitInterpolation } from '@adaskothebeast/splines';

// Your data points (x, y pairs)
const data = [
  [0, 0],
  [1, 2],
  [2, 3],
  [3, 5],
  [4, 4],
];

// Create the spline
const spline = new MonotoneCubicHermitInterpolation(data);

// Interpolate at any x value
spline.interpolate(1.5);  // → ~2.5 (smooth value between points)
spline.interpolate(2.7);  // → ~4.1
```

---

## 🔧 Algorithms

### Monotone Cubic Hermite Interpolation

**Best for:** Data that should never overshoot (sensor readings, percentages, probabilities)

```typescript
import { MonotoneCubicHermitInterpolation } from '@adaskothebeast/splines';

const spline = new MonotoneCubicHermitInterpolation([
  [0, 0],
  [1, 100],
  [2, 100],  // flat section
  [3, 50],
]);

// Guarantees: if your data goes 0 → 100, interpolated values stay in [0, 100]
// No overshooting, no undershooting
```

**Why use it?**
- Preserves monotonicity — if data goes up, interpolation goes up
- No oscillation or ringing artifacts  
- Perfect for data with physical constraints

📚 [Wikipedia: Monotone cubic interpolation](https://en.wikipedia.org/wiki/Monotone_cubic_interpolation)

---

### Natural Cubic Spline

**Best for:** Smooth curves where overshooting is acceptable (animation, visualization)

```typescript
import { NaturalSpline } from '@adaskothebeast/splines';

const spline = new NaturalSpline([
  [0, 0],
  [1, 2],
  [2, 0],
  [3, 2],
]);

// Produces the smoothest possible curve (minimizes curvature)
// May overshoot at peaks/valleys — that's often desirable for animation
```

**Why use it?**
- Maximally smooth — continuous first and second derivatives
- Natural-looking curves for visualization
- Classic algorithm used in CAD and graphics

📚 [Learn more: Natural Cubic Spline](https://towardsdatascience.com/numerical-interpolation-natural-cubic-spline-52c1157b98ac)

---

## 📖 API

### Input Formats

Both algorithms accept data as tuples or `NumberPair` objects:

```typescript
// Tuple format (recommended)
const data: [number, number][] = [[0, 0], [1, 2], [2, 4]];

// Object format
import { NumberPair } from '@adaskothebeast/splines';
const data = [new NumberPair(0, 0), new NumberPair(1, 2), new NumberPair(2, 4)];
```

### Methods

```typescript
const spline = new MonotoneCubicHermitInterpolation(data);

// Interpolate at any x value
const y = spline.interpolate(x);
```

**Notes:**
- Data is automatically sorted by x-values
- Extrapolation beyond data range uses the boundary polynomial
- Empty arrays will throw an error

---

## 🆚 Which Algorithm Should I Use?

| Scenario | Recommendation |
|----------|----------------|
| Sensor data (temperature, pressure) | Monotone Cubic Hermite |
| Progress bars, percentages | Monotone Cubic Hermite |
| Animation keyframes | Natural Spline |
| Chart smoothing | Either (try both!) |
| Financial data | Monotone Cubic Hermite |
| Bezier-like curves | Natural Spline |

**Rule of thumb:** If overshooting would be a bug, use Monotone. If overshooting adds natural motion, use Natural.

---

## 🧪 Example: Smooth a Noisy Signal

```typescript
import { MonotoneCubicHermitInterpolation } from '@adaskothebeast/splines';

// Sparse measurements
const measurements = [
  [0, 20.1],
  [5, 22.3],
  [10, 25.8],
  [15, 24.2],
  [20, 26.5],
];

const spline = new MonotoneCubicHermitInterpolation(measurements);

// Generate smooth curve with 100 points
const smoothCurve = [];
for (let x = 0; x <= 20; x += 0.2) {
  smoothCurve.push({ x, y: spline.interpolate(x) });
}
```

---

## 🌡️ Example: Thermodynamics — Vapor Pressure to Temperature

Invert steam table data to get temperature from saturation vapor pressure.
Standard tables give you `T → P`, but sometimes you need `P → T`.

```typescript
import { MonotoneCubicHermitInterpolation } from '@adaskothebeast/splines';

// Water saturation vapor pressure data (from steam tables)
// Format: [Pressure in kPa, Temperature in °C]
const vaporPressureToTemp = [
  [0.6113, 0],      // Triple point
  [1.2281, 10],
  [2.3392, 20],
  [4.2470, 30],
  [7.3849, 40],
  [12.352, 50],
  [19.946, 60],
  [31.201, 70],
  [47.414, 80],
  [70.182, 90],
  [101.33, 100],    // Boiling point at 1 atm
  [143.38, 110],
  [198.67, 120],
];

// Create inverse lookup: Pressure → Temperature
const pressureToTempSpline = new MonotoneCubicHermitInterpolation(vaporPressureToTemp);

// Now you can find saturation temperature for any pressure
pressureToTempSpline.interpolate(101.33);  // → 100°C (boiling point at 1 atm)
pressureToTempSpline.interpolate(50);      // → ~81.3°C
pressureToTempSpline.interpolate(20);      // → ~60.1°C

// Useful for:
// - HVAC calculations
// - Psychrometric charts
// - Boiler/steam system design
// - Dew point calculations
```

**Why Monotone Cubic Hermite here?** Vapor pressure is strictly monotonic with temperature — using monotone interpolation guarantees physically meaningful results (no negative pressures, no temperature inversions).

---

## 📄 License

[AGPL-3.0-or-later](LICENSE) © Adam "AdaskoTheBeAsT" Pluciński

---

## 🤝 Contributing

Issues and PRs welcome! This is a small, focused library — let's keep it that way.

```bash
git clone https://github.com/AdaskoTheBeAsT/Splines-TypeScript.git
cd Splines-TypeScript
yarn install
yarn test
```
