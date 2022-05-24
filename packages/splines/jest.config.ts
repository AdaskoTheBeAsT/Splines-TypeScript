/* eslint-disable */
const reportPath = './.reports/packages/splines/';

export default {
  displayName: 'splines',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageDirectory: `../../${reportPath}coverage`,
  coverageReporters: ['cobertura', 'html', 'lcov'],
  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: reportPath,
        reportTitle: 'Test',
        additionalResultsProcessors: [],
        coverageLink: 'coverage/index.html',
        resultJson: 'test.stare.json',
        resultHtml: 'test.stare.html',
        report: true,
        reportSummary: true,
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: reportPath,
        filename: 'test-report.html',
        pageTitle: 'Test',
        expand: true,
      },
    ],
    [
      'jest-xunit',
      {
        outputPath: reportPath,
        filename: 'test-report.xunit.xml',
        traitsRegex: [
          { regex: /\(Test Type:([^,)]+)(,|\)).*/g, name: 'Category' },
          { regex: /.*Test Traits: ([^)]+)\).*/g, name: 'Type' },
        ],
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: reportPath,
        outputName: 'test.sonar.xml',
      },
    ],
    [
      'jest-trx-results-processor',
      {
        outputFile: `${reportPath}test.trx`,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: reportPath,
        outputName: 'test.junit.xml',
      },
    ],
  ],
};
