const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  outputPath: '../../dist/libs/splines',
  main: './src/index.ts',
  additionalEntryPoints: [
    './src/NaturalSpline.ts',
    './src/MonotoneCubicHermiteInterpolation.ts',
  ],
  tsConfig: './tsconfig.lib.json',
  assets: [
    { input: '.', glob: 'README.md', output: '.' },
    { input: '.', glob: 'LICENSE', output: '.' },
  ],
  format: ['esm', 'cjs'],
  generateExportsField: true,
  compiler: 'babel',
};

const config = withNx(options, {
  // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  // e.g.
  // output: { sourcemap: true },
});

module.exports = config;
