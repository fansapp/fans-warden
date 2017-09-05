import { Types } from './index';

export const isEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

export const isObject = obj => typeof obj === 'object' && !Array.isArray(obj);

export const isArray = obj => Array.isArray(obj);

export const isValidType = type => (
  isObject(type) && type.hasOwnProperty('required') && type.hasOwnProperty('type')
);


export const typeFactory = (type) => ({
  ...type,
  required: false,
  vals: null,
  isRequired: {
    ...type,
    required: true,
    vals: null,
  },
});


export const validateValues = (localValue, typeOf, values) => {
  if (values.length === 0) {
    return;
  }

  if (typeOf !== Types.array.typeOf) {
    if (values.some(v => typeof v !== typeOf)) {
      throw "the values must match the given 'Type'";
    }
    if (!values.includes(localValue)) {
      throw `'${localValue}' does not appear to be a value provided to values()`;
    }
  } else {
    if (values.some(v => typeof v === 'object')) {
      throw "the values for an array cannot be objects or arrays, please use arrayOf() or shapeOf() then provide values for deep structure";
    }
    if (localValue.some(v => !values.includes(v))) {
      throw `some values of '${JSON.stringify(localValue)}' do not appear to be provided to values()`;
    }
  }
};

export function values(vals) {
  return {
    ...this,
    vals,
    isRequired: {
      ...this.isRequired,
      vals,
    },
  };
}
