export const isEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

export const isObject = obj => typeof obj === 'object' && !Array.isArray(obj);

export const isArray = obj => Array.isArray(obj);
