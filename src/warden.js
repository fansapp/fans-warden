import get from 'lodash.get';

import Types from './types';

const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;


export default (blueprint, local = (window ? window.localStorage : {})) => {
  let isValid = true;

  const crawler = (obj, localVal) => {
    console.log(obj);
    const o = obj;
    Object.keys(o).forEach((k) => {
      const localValue = localVal[k];
      const blueprintValue = o[k]();

      if (blueprintValue.required && localValue === undefined) {
        throw `${k} is required`;
      }

      switch (blueprintValue.type) {
        // primitives
        case Types.string().type:
          if (typeof localValue !== Types.string().typeOf) {
            throw `${k} needs to be a string`;
            return;
          }
          break;

        case Types.number().type:
          if (typeof localValue !== Types.number().typeOf) {
            throw `${k} needs to be a number`;
            return;
          }
          break;

        case Types.bool().type:
          if (typeof localValue !== Types.bool().typeOf) {
            throw `${k} needs to be a boolean`;
            return;
          }
          break;

        case Types.shape().type:
          if (typeof localValue !== Types.shape().typeOf || Array.isArray(localValue)) {
            throw `${k} needs to be a shape`;
            return;
          }
          break;

        case Types.array().type:
          if (typeof localValue !== Types.array().typeOf || !Array.isArray(localValue)) {
            throw `${k} needs to be an array`;
            return;
          }
          break;

        // advanced

        case Types.arrayOf(Types.array)().type:
          if (typeof localValue !== Types.array().typeOf || !Array.isArray(localValue)) {
            throw `${k} needs to be an array`;
            return;
          }
          const verifyArrayOf = (arr, arrBlueprint) => {
            arr.forEach((v) => {
              if (arrBlueprint.type === Types.arrayOf(Types.array)().type) {
                verifyArrayOf(v, arrBlueprint.of());
              } else if (arrBlueprint.type === Types.shapeOf({})().type) {
                crawler(arrBlueprint);
              } else if (arrBlueprint.type === Types.array().type && (typeof v !== arrBlueprint.typeOf || !Array.isArray(v))) {
                throw `${k} needs to be an array containing the specified 'Type'`;
                return;
              } else if (arrBlueprint.type === Types.shape().type && (typeof v !== arrBlueprint.typeOf || Array.isArray(v))) {
                throw `${k} needs to be an array containing the specified 'Type'`;
                return;
              } else if (typeof v !== arrBlueprint.typeOf) {
                throw `${k} needs to be an array containing the specified 'Type'`;
                return;
              }
            });
          };

          verifyArrayOf(localValue, blueprintValue.of());
          break;

        case Types.shapeOf({})().type:
          if (typeof localValue !== Types.shape().typeOf || Array.isArray(localValue)) {
            throw `${k} needs to be a shape`;
            return;
          }
          if (typeof blueprintValue.of !== Types.shape().typeOf) {
            throw `${k} needs to be an shape containing an 'object'`;
            return;
          }
          if (blueprintValue.of !== undefined && !isEmpty(blueprintValue.of)) {
            crawler(blueprintValue.of, localValue);
          }
          break;

        default: break;
      }
    });
  };

  crawler(blueprint, local);
  return isValid;
}

