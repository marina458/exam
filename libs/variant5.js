/**
 * @typedef {{sign: '+' | '-' | '', coefficients: number[], exponent: number}} SplitValue
 */

/**
 * Check if a number is integer
 * @param {number | boolean} value
 * @return {boolean} isInteger
 */
function isInteger (value) {
  if (typeof value === 'boolean') {
    return true
  }

  return isFinite(value)
    ? (value === Math.round(value))
    : false
}

/**
 * Calculate the sign of a number
 * @param {number} x
 * @returns {number}
 */
function sign(x) {
  if (x > 0) {
    return 1
  } else if (x < 0) {
    return -1
  } else {
    return 0
  }
}

/**
 * Calculate the base-2 logarithm of a number
 * @param {number} x
 * @returns {number}
 */
function log2(x) {
  if (x <= 0) {
    throw new Error('Input must be a positive number');
  }
  return Math.log(x) / Math.LN2;
}





/**
 * Split a number into sign, coefficients, and exponent
 * @param {number | string} value
 * @return {SplitValue}
 *              Returns an object containing sign, coefficients, and exponent
 */
function splitNumber (value) {
  // parse the input value
  const match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/)
  if (!match) {
    throw new SyntaxError('Invalid number ' + value)
  }

  const sign = match[1]
  const digits = match[2]
  let exponent = parseFloat(match[4] || '0')

  const dot = digits.indexOf('.')
  exponent += (dot !== -1) ? (dot - 1) : (digits.length - 1)

  const coefficients = digits
  .replace('.', '') // remove the dot
  .replace(/^0+/, function (zeros) {
    exponent -= zeros.length; // зменшення експоненти
    return '';
  })
  .replace(/0*$/, '') // remove trailing zeros
  .split('')
  .map(Number);

  if (coefficients.length === 0) {
    coefficients.push(0)
    exponent++
  }

  return { sign, coefficients, exponent }
}

/**
 * Format a number with fixed notation.
 * @param {number | string} value
 * @param {number} [precision=undefined]  Optional number of decimals after the
 *                                        decimal point. null by default.
 */
function toFixed(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }

  // Округляємо число до потрібної кількості цифр після коми
  const factor = Math.pow(10, precision);
  const roundedValue = Math.round(value * factor) / factor;

  // Форматуємо результат до потрібної точності
  let result = roundedValue.toString();
  const decimalIndex = result.indexOf('.');

  if (precision > 0) {
    if (decimalIndex === -1) {
      // Якщо в числі немає десяткової крапки, додаємо її
      result += '.';
    }

    // Додаємо необхідну кількість нулів
    const decimals = result.split('.')[1] || '';
    const missingZeros = precision - decimals.length;
    result += '0'.repeat(missingZeros);
  }

  return result;
}

/**
 * Minimum number added to one that makes the result different than one
 */
const DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16

function roundDigits(splitValue, precision) {
  const { coefficients, exponent } = splitValue;

  if (precision < 0) {
    return { coefficients: [0], exponent: 0 };
  }

  const factor = Math.pow(10, precision - coefficients.length);
  const rounded = Math.round(parseFloat(coefficients.join('')) * factor) / factor;
  return splitNumber(rounded);
}


/**
 * Compares two floating point numbers.
 * @param {number} x          First value to compare
 * @param {number} y          Second value to compare
 * @param {number} [epsilon]  The maximum relative difference between x and y
 *                            If epsilon is undefined or null, the function will
 *                            test whether x and y are exactly equal.
 * @return {boolean} whether the two numbers are nearly equal
 */
function nearlyEqual(x, y, epsilon) {
  // Handle Infinity
  if (!isFinite(x) || !isFinite(y)) {
    return false;
    // Handle NaN
  } else if(x === NaN || y === NaN) {
    return false;
  } else if(epsilon === null || epsilon === undefined) {
    return x === y;
  } else if(x === y) {
    return true
  } else {
    const diff = Math.abs(x - y);
    return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
  }
}

function zeros(count) {
  return Array(count).fill(0);
}

module.exports = {
  zeros,
  isInteger,
  sign,
  log2,
  splitNumber,
  toFixed,
  DBL_EPSILON,
  nearlyEqual,
  roundDigits,
}