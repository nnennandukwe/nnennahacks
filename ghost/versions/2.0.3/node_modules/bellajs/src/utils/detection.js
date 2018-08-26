// utils / detection

const ob2Str = (val) => {
  return {}.toString.call(val);
};

export const isNull = (val) => {
  return ob2Str(val) === '[object Null]';
};

export const isUndefined = (val) => {
  return ob2Str(val) === '[object Undefined]';
};

export const isFunction = (val) => {
  return ob2Str(val) === '[object Function]';
};

export const isString = (val) => {
  return ob2Str(val) === '[object String]';
};

export const isNumber = (val) => {
  return ob2Str(val) === '[object Number]';
};

export const isInteger = (val) => {
  return Number.isInteger(val);
};

export const isArray = (val) => {
  return Array.isArray(val);
};

export const isObject = (val) => {
  return ob2Str(val) === '[object Object]' && !isArray(val);
};

export const isBoolean = (val) => {
  return val === true || val === false;
};

export const isDate = (val) => {
  return val instanceof Date && !isNaN(val.valueOf());
};

export const isElement = (v) => {
  return ob2Str(v).match(/^\[object HTML\w*Element]$/);
};

export const isLetter = (val) => {
  let re = /^[a-z]+$/i;
  return isString(val) && re.test(val);
};

export const isEmail = (val) => {
  let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return isString(val) && re.test(val);
};

export const isEmpty = (val) => {
  return !val || isUndefined(val) || isNull(val) ||
    isString(val) && val === '' ||
    isArray(val) && JSON.stringify(val) === '[]' ||
    isObject(val) && JSON.stringify(val) === '{}';
};

export const hasProperty = (ob, k) => {
  if (!ob || !k) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(ob, k);
};
