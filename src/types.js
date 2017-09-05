import { isObject, typeFactory } from './helpers';
import { values, min, max, range } from './decorators';


const primitives = {
  string: typeFactory({ type: 'string', typeOf: 'string', values }),
  number: typeFactory({ type: 'number', typeOf: 'number', minValue: null, maxValue: null, values, min, max, range }),
  bool: typeFactory({ type: 'bool', typeOf: 'boolean', values }),
  array: typeFactory({ type: 'array', typeOf: 'object', values }),
  shape: typeFactory({ type: 'shape', typeOf: 'object' }),
};

const advanced = {
  arrayOf: (of = null) => {
    if (of === null) {
      return primitives.array;
    }
    if (!isObject(of) || !Object.keys({ ...primitives, ...advanced }).some(k => k === of.type)) {
      throw "arrayOf() needs to be passed a 'Type'";
    }
    return typeFactory({ type: 'arrayOf', of, values });
  },
  shapeOf: (of = null) => {
    if (of === null) {
      return primitives.shape;
    }
    if (!isObject(of)) {
      throw "shapeOf() needs to be passed an 'object'";
    }
    return typeFactory({ type: 'shapeOf', of });
  },
};


export default {
  ...primitives,
  ...advanced,
};
