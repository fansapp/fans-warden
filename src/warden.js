import Types from './types';
import { isEmpty, isObject, isArray, validateValues } from './helpers';


const crawler = (obj, localVal) => {
  Object.keys(obj).forEach((k) => {
    const localValue = localVal[k];
    const blueprintValue = obj[k];

    if (!isObject(blueprintValue)
        || !blueprintValue.hasOwnProperty('required')
        || !blueprintValue.hasOwnProperty('type')) {
      throw "unexpected 'Type'";
    }
    if (blueprintValue.vals !== null && !isArray(blueprintValue.vals)) {
      throw `'values()' needs to have an array of possible values as argument.`;
    }
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
        if (blueprintValue.vals !== null) {
          validateValues(localValue, blueprintValue.typeOf, blueprintValue.vals);
        }
        break;

      case Types.number.type:
        if (typeof localValue !== Types.number.typeOf) {
          throw `'${k}' needs to be a number`;
        }
        if (blueprintValue.vals !== null) {
          validateValues(localValue, blueprintValue.typeOf, blueprintValue.vals);
        }
        break;

      case Types.bool.type:
        if (typeof localValue !== Types.bool.typeOf) {
          throw `'${k}' needs to be a boolean`;
        }
        if (blueprintValue.vals !== null) {
          validateValues(localValue, blueprintValue.typeOf, blueprintValue.vals);
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
        if (blueprintValue.vals !== null) {
          validateValues(localValue, blueprintValue.typeOf, blueprintValue.vals);
        }
        break;

      // advanced

      case Types.arrayOf(Types.array).type: {
        if (!isArray(localValue)) {
          throw `'${k}' needs to be an array`;
        }

        const verifyOfValues = (blueprint, value) => {
          if (blueprint.vals !== null) {
            if (isArray(blueprint.vals) && blueprint.vals.some(v => typeof v !== blueprint.of.typeOf)) {
              throw `some values in '${JSON.stringify(blueprint.vals)}' are uncoherent to the provided 'Type' in arrayOf()`;
            }
            validateValues(value, Types.array.typeOf, blueprint.vals);
          }
        };
        const verifyArrayOf = (arrBlueprint, arr) => {
          if (!isObject(arrBlueprint)
              || !arrBlueprint.hasOwnProperty('required')
              || !arrBlueprint.hasOwnProperty('type')) {
            throw "unexpected 'Type'";
          }
          if (!isArray(arr)) {
            throw `'${JSON.parse(arr)}' must be an array`;
          }
          arr.forEach((v) => {
            switch (arrBlueprint.type) {
              case Types.arrayOf(Types.array).type:
                verifyArrayOf(arrBlueprint.of, v);
                verifyOfValues(arrBlueprint, v);
                break;
              case Types.shapeOf({}).type:
                crawler(arrBlueprint.of, v);
                break;
              case Types.array.type:
                if(!isArray(v)) {
                  throw `'${k}' needs to be an array containing the specified 'Type'`;
                }
                validateValues(v, Types.array.typeOf, arrBlueprint.vals);
                break;
              case Types.shape.type:
                if (!isObject(v)) {
                  throw `'${k}' needs to be an array containing the specified 'Type'`;
                }
                break;
              default:
                if (typeof v !== arrBlueprint.typeOf) {
                  throw `'${k}' needs to be an array containing the specified 'Type'`;
                }
                if (arrBlueprint.vals !== null) {
                  throw "can't set values() inside arrayOf() except it is an arrayOf() or array, did you mean arrayOf(Type).values()?";
                }
                break;
            }
          });
        };
        verifyArrayOf(blueprintValue.of, localValue);
        verifyOfValues(blueprintValue, localValue);
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
