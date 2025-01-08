const {
  isInteger,
  sign,
  log2,
  toFixed,
  DBL_EPSILON,
  nearlyEqual,
  zeros,
} = require('./variant5.js');

describe('mathUtils.js utility functions', () => {
  describe('isInteger', () => {
    test('should return true for integers', () => {
      expect(isInteger(5)).toBe(true);
      expect(isInteger(-10)).toBe(true);
    });

    test('should return false for non-integers', () => {
      expect(isInteger(5.5)).toBe(false);
      expect(isInteger(-10.1)).toBe(false);
    });

    test('should return true for booleans', () => {
      expect(isInteger(true)).toBe(true);
      expect(isInteger(false)).toBe(true);
    });
  });

  describe('sign', () => {
    test('should return correct sign of numbers', () => {
      expect(sign(5)).toBe(1);
      expect(sign(-10)).toBe(-1);
      expect(sign(0)).toBe(0);
    });

    test('should handle edge cases with fallback implementation', () => {
      const originalMathSign = Math.sign;
      Math.sign = undefined; // Simulate environment without Math.sign
      const localSign = require('./variant5.js').sign;

      expect(localSign(5)).toBe(1);
      expect(localSign(-10)).toBe(-1);
      expect(localSign(0)).toBe(0);

      Math.sign = originalMathSign; // Restore Math.sign
    });
  });

  describe('log2', () => {
    test('should calculate base-2 logarithm', () => {
      expect(log2(8)).toBeCloseTo(3);
      expect(log2(1)).toBeCloseTo(0);
    });

    test('should throw an error for non-positive numbers', () => {
        expect(() => log2(-1)).toThrow('Input must be a positive number');
        expect(() => log2(0)).toThrow('Input must be a positive number');
    });

    test('should handle environment without Math.log2', () => {
      const originalLog2 = Math.log2;
      Math.log2 = undefined; // Simulate environment without Math.log2
      const localLog2 = require('./variant5.js').log2;

      expect(localLog2(8)).toBeCloseTo(3);
      expect(localLog2(1)).toBeCloseTo(0);

      Math.log2 = originalLog2; // Restore Math.log2
    });
  });

  describe('splitNumber', () => {
    test('should split numbers correctly', () => {
      expect(splitNumber('-0.00123')).toEqual({
        sign: '-',
        coefficients: [1, 2, 3],
        exponent: -3,
      });

      expect(splitNumber(123.45)).toEqual({
        sign: '',
        coefficients: [1, 2, 3, 4, 5],
        exponent: 2,
      });
    });

    test('should handle edge cases', () => {
      expect(splitNumber(0)).toEqual({
        sign: '',
        coefficients: [0],
        exponent: 0,
      });

      expect(() => splitNumber('invalid')).toThrow('Invalid number invalid');
    });
  });

  describe('toFixed', () => {
    test('should format numbers with fixed notation', () => {
      expect(toFixed(123.456, 2)).toBe('123.46');
      expect(toFixed(0.00123, 3)).toBe('0.001');
      expect(toFixed(-123.456, 1)).toBe('-123.5');
      expect(toFixed(1, 2)).toBe('1.00');
    });

    test('should handle edge cases', () => {
      expect(toFixed(Infinity)).toBe('Infinity');
      expect(toFixed(NaN)).toBe('NaN');
    });
  });

  describe('DBL_EPSILON', () => {
    test('should match the correct epsilon value', () => {
      expect(DBL_EPSILON).toBeCloseTo(2.220446049250313e-16);
    });
  });

  describe('nearlyEqual', () => {
    test('should compare numbers correctly', () => {
      expect(nearlyEqual(1.0, 1.0)).toBe(true);
      expect(nearlyEqual(1.0, 1.000000000000001)).toBe(false);
      expect(nearlyEqual(1.0, 1.1)).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(nearlyEqual(NaN, NaN)).toBe(false);
      expect(nearlyEqual(Infinity, Infinity)).toBe(false);
      expect(nearlyEqual(-Infinity, Infinity)).toBe(false);
    });

    test('should respect epsilon', () => {
      expect(nearlyEqual(1.0, 1.1, 0.2)).toBe(true);
      expect(nearlyEqual(1.0, 1.2, 0.1)).toBe(false);
    });
  });

  describe('zeros function', () => {
    test('should return arrays of zeros', () => {
      expect(zeros(3)).toEqual([0, 0, 0]);
    });
  });

  const { roundDigits, splitNumber } = require('./variant5.js'); // Замініть шлях на ваш файл

describe('roundDigits', () => {
  test('should round digits to the specified precision', () => {
    expect(roundDigits({ coefficients: [1, 2, 3], exponent: 2 }, 2)).toEqual({
      sign: '',
      coefficients: [1, 2],
      exponent: 2
    });

    expect(roundDigits({ coefficients: [1, 2, 3, 4], exponent: 1 }, 3)).toEqual({
      sign: '',
      coefficients: [1, 2, 3],
      exponent: 3
    });
  });

  test('should return 0 if precision is less than 0', () => {
    expect(roundDigits({ coefficients: [1, 2, 3], exponent: 2 }, -1)).toEqual({
      coefficients: [0],
      exponent: 0
    });
  });
});

});
