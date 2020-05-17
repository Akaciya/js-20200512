/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let result = Object.entries(obj).filter(function ([key, value], index, arr) {
    if (!fields.includes(key)) {
      return arr;
    }
  });
  return Object.fromEntries(result);
};
