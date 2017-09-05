import { isArray } from './helpers';


export function range(minValue = null, maxValue = null) {
  if (minValue === null || maxValue === null) {
    throw 'range() is missing arguments';
  }
  return {
    ...this,
    minValue,
    maxValue,
    isRequired: {
      ...this.isRequired,
      minValue,
      maxValue,
    },
  };
}

export function min(minValue = null) {
  if (minValue === null) {
    throw 'min() is missing argument';
  }
  return {
    ...this,
    minValue,
    isRequired: {
      ...this.isRequired,
      minValue,
    },
  };
}

export function max(maxValue = null) {
  if (maxValue === null) {
    throw 'max() is missing argument';
  }
  return {
    ...this,
    maxValue,
    isRequired: {
      ...this.isRequired,
      maxValue,
    },
  };
}

export function values(vals) {
  if (!isArray(vals)) {
    throw 'values() must take an array as argument';
  }
  return {
    ...this,
    vals,
    isRequired: {
      ...this.isRequired,
      vals,
    },
  };
}
