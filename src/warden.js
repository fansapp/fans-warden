import Types from './types';
import { isEmpty, isObject, isArray, isValidType, validateValues, validateRange } from './helpers';


const crawler = (obj, localVal) => {
  Object.keys(obj).forEach((k) => {
    const localValue = localVal[k];
    const blueprintValue = obj[k];

    // if doesn't have the structure of a Type
    if (!isValidType(blueprintValue)) {
      throw "unexpected 'Type'";
    }
    // if values() has been passed something that is not an array
    if (blueprintValue.vals !== null && !isArray(blueprintValue.vals)) {
      throw `'values()' needs to have an array of possible values as argument.`;
    }
    // if the Type is marked as required and the key is not present
    if (blueprintValue.required && localValue === undefined) {
      throw `'${k}' is required`;
    }
    // if the Type is marked as not required and the key isn't present, skip validation for this key
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
        validateRange(localValue, blueprintValue);
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

      case Types.func.type:
        if (typeof localValue !== Types.func.typeOf) {
          throw `'${k}' needs to be a function`;
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
        // compares the values passed in values() to the typeof of the specified Type inside 'of'
        const verifyOfValues = (blueprint, value) => {
          if (blueprint.vals !== null) {
            if (isArray(blueprint.vals) && blueprint.vals.some(v => typeof v !== blueprint.of.typeOf)) {
              throw `some values in '${JSON.stringify(blueprint.vals)}' are incoherent to the provided 'Type' in arrayOf()`;
            }
            validateValues(value, Types.array.typeOf, blueprint.vals);
          }
        };
        // validates what is inside the arrayOf()
        const verifyArrayOf = (arrBlueprint, arr) => {
          // if inside the arrayOf() doesn't contain a Type
          if (!isValidType(arrBlueprint)) {
            throw "unexpected 'Type'";
          }
          // if the current value isn't an array
          if (!isArray(arr)) {
            throw `'${JSON.parse(arr)}' must be an array`;
          }
          // loop over all contains of value to validate
          arr.forEach((v) => {
            switch (arrBlueprint.type) {
              // if the case is arrayOf(arrayOf()), each element is faced with the same validation as the parent
              case Types.arrayOf(Types.array).type:
                verifyArrayOf(arrBlueprint.of, v);
                verifyOfValues(arrBlueprint, v);
                break;
              // if the case is arrayOf(shapeOf()), each element is validated through the whole crawler process
              case Types.shapeOf({}).type:
                crawler(arrBlueprint.of, v);
                break;
              // if the case is arrayOf(array)
              case Types.array.type:
                if(!isArray(v)) {
                  throw `'${k}' needs to be an array of type '${arrBlueprint.type}'`;
                }
                // test the values()
                validateValues(v, Types.array.typeOf, arrBlueprint.vals);
                break;
              // if the case is arrayOf(shape)
              case Types.shape.type:
                if (!isObject(v)) {
                  throw `'${k}' needs to be an array of type '${arrBlueprint.type}'`;
                }
                break;
              // if the case is arrayOf(any other primitive)
              default:
                if (typeof v !== arrBlueprint.typeOf) {
                  throw `'${k}' needs to be an array of type '${arrBlueprint.type}'`;
                }
                if (arrBlueprint.type === Types.number.type) {
                  validateRange(v, arrBlueprint);
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
