const isRequired = (obj) => {
  return { ...obj, required: true };
};


const skeleton = { required: false, isRequired: () => isRequired(this) };
const primitives = {
  string: () => ({ ...skeleton, type: 'string', typeOf: 'string' }),
  number: () => ({ ...skeleton, type: 'number', typeOf: 'number' }),
  bool: () => ({ ...skeleton, type: 'bool', typeOf: 'boolean' }),
  array: () => ({ ...skeleton, type: 'array', typeOf: 'object' }),
  shape: () => ({ ...skeleton, type: 'shape', typeOf: 'object' }),
};

const advanced = {
  arrayOf: (of) => () => {
    if (typeof of !== 'function'){
      throw "arrayOf() needs to be passed a 'Type'";
    }

    if (!Object.keys({ ...primitives, ...advanced }).some(k => primitives[k]().type === of().type)) {
      throw "arrayOf() needs to be passed a 'Type'";
    }

    return { ...skeleton, type: 'arrayOf', of, isRequired: () => isRequired(this) };
  },

  shapeOf: (of) => () => {
    if (typeof of !== 'object'){
      throw "shapeOf() needs to be passed an 'object'";
    }

    return { ...skeleton, type: 'shapeOf', of, isRequired: () => isRequired(this) };
  },
};


export default {
  ...primitives,
  ...advanced,
};
