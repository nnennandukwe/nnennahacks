// utils / random

const MAX_NUMBER = Number.MAX_SAFE_INTEGER;

export const random = (min, max) => {
  if (!min || min < 0) {
    min = 0;
  }
  if (!max) {
    max = MAX_NUMBER;
  }
  if (min === max) {
    return max;
  }
  if (min > max) {
    min = Math.min(min, max);
    max = Math.max(min, max);
  }
  let offset = min;
  let range = max - min + 1;
  return Math.floor(Math.random() * range) + offset;
};

