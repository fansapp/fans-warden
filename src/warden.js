import get from 'lodash.get';

import Types from './types';

export default (blueprint, local = {}) => {
  let isValid = true;

  const crawler = (obj, key = '') => {
    const o = obj;
    Object.keys(o).forEach((k) => {
      const curKey = !key ? k : `${key}.k`;

      const localValue = get(local, curKey, undefined);
      const blueprintValue = o[k]();

      if (blueprintValue.required && localValue === undefined) {
        throw `${curKey} is required`;
      }

      if (typeof blueprintValue.type === 'string') {
        switch (o[k]) {
        case Types.string:
          if (typeof localValue !== Types.string().type) {
            isValid = false;
            throw `${curKey} needs to be a string`;
            return;
          }
          break;
        case Types.number:
          if (typeof localValue !== Types.number().type) {
            isValid = false;
            throw `${curKey} needs to be a number`;
            return;
          }
          break;
        case Types.bool:
          if (typeof localValue !== Types.bool().type) {
            isValid = false;
            throw `${curKey} needs to be a boolean`;
            return;
          }
          break;
        case Types.shape:
          if (typeof localValue !== Types.shape().type || Array.isArray(localValue)) {
            isValid = false;
            throw `${curKey} needs to be a shape`;
            return;
          }
          break;
        case Types.array:
          if (typeof localValue !== Types.array().type || !Array.isArray(localValue)) {
            isValid = false;
            throw `${curKey} needs to be an array`;
            return;
          }
          break;
        case 'function':
          break;
        default: break;
        }
      }
    });
  };

  crawler(blueprint);
  return isValid;
}

