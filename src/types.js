import { isObject } from './helpers';


const typeFactory = (type) => ({
  ...type,
  required: false,
  isRequired: {
    ...type,
    required: true,
  },
});

const primitives = {
  string: typeFactory({ type: 'string', typeOf: 'string' }),
  number: typeFactory({ type: 'number', typeOf: 'number' }),
  bool: typeFactory({ type: 'bool', typeOf: 'boolean' }),
  array: typeFactory({ type: 'array', typeOf: 'object' }),
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
    return typeFactory({ type: 'arrayOf', of });
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
