import Types from './types';
import { isEmpty, isObject, isArray } from './helpers';

const crawler = (obj, localVal) => {
  Object.keys(obj).forEach((k) => {
    const localValue = localVal[k];
    const blueprintValue = obj[k];

    if (blueprintValue.required && localValue === undefined) {
      throw `'${k}' is required`;
    }
    if (!blueprintValue.required && localValue === undefined) {
      return;
    }

    switch (blueprintValue.type) {
      // primitives
    case Types.string.type:
      if (typeof localValue !== Types.string.typeOf) {
        throw `'${k}' needs to be a string`;
      }
      break;

    case Types.number.type:
      if (typeof localValue !== Types.number.typeOf) {
        throw `'${k}' needs to be a number`;
      }
      break;

    case Types.bool.type:
      if (typeof localValue !== Types.bool.typeOf) {
        throw `'${k}' needs to be a boolean`;
      }
      break;

    case Types.shape.type:
      if (!isObject(localValue)) {
        throw `'${k}' needs to be a shape`;
      }
      break;

    case Types.array.type:
      if (!isArray(localValue)) {
        throw `'${k}' needs to be an array`;
      }
      break;

      // advanced

    case Types.arrayOf(Types.array).type: {
      if (!isArray(localValue)) {
        throw `'${k}' needs to be an array`;
      }
      const verifyArrayOf = (arrBlueprint, arr) => {
        arr.forEach((v) => {
          if (arrBlueprint.type === Types.arrayOf(Types.array).type) {
            verifyArrayOf(arrBlueprint.of, v);
          } else if (arrBlueprint.type === Types.shapeOf({}).type) {
            crawler(arrBlueprint.of, v);
          } else if (arrBlueprint.type === Types.array.type && (!isArray(v))) {
            throw `'${k}' needs to be an array containing the specified 'Type'`;
          } else if (arrBlueprint.type === Types.shape.type && (!isObject(v))) {
            throw `'${k}' needs to be an array containing the specified 'Type'`;
          } else if (typeof v !== arrBlueprint.typeOf) {
            throw `'${k}' needs to be an array containing the specified 'Type'`;
          }
        });
      };
      verifyArrayOf(blueprintValue.of, localValue);
      break;
    }

    case Types.shapeOf({}).type:
      if (!isObject(blueprintValue.of)) {
        throw `'shapeOf' needs to have an 'object' as argument`;
      }
      if (!isObject(localValue)) {
        throw `'${k}' needs to be a shape`;
      }
      if (blueprintValue.of !== undefined && !isEmpty(blueprintValue.of)) {
        crawler(blueprintValue.of, localValue);
      }
      break;

    default: break;
    }
  });
};


export default (
  blueprint = null,
  data = null
) => (
  new Promise((resolve, reject) => {
    try {
      if (blueprint === null || !isObject(blueprint)) {
        throw "first argument needs to be a blueprint of type 'object' containing the 'Type' rules";
      }
      if (data === null || !isObject(blueprint)) {
        throw "second argument needs to be the 'object' to be validated";
      }
      crawler(blueprint, data);
      resolve(data);
    }
    catch (e) {
      reject(e);
    }
  })
);
