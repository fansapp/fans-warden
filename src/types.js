const isRequired = (obj) => {
  return { ...obj, required: true };
};


const skeleton = { required: false, isRequired: () => isRequired(this) };
const primitives = {
  string: () => ({ ...skeleton, type: 'string' }),
  number: () => ({ ...skeleton, type: 'number' }),
  bool: () => ({ ...skeleton, type: 'boolean' }),
  array: () => ({ ...skeleton, type: 'object' }),
  shape: () => ({ ...skeleton, type: 'object' }),
};


export default {
  ...primitives,
};
