/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  //1 вариант
  /*let result = {};
  for (let item of fields) {
    if(obj.hasOwnProperty(item)) {
      result[item] = obj[item];
    }
  }
  return result;*/

  //2 вариант
  /*let newObj = {};
  for(let [key, value] of Object.entries(obj)) {
    fields.map(function (item) {
      if (key === item) {
        newObj[item] = value;
      }
    });
  }
  return newObj;*/

  //3 вариант
  let result = Object.entries(obj).filter(function ([key, value], index, arr) {
    if (fields.includes(key)) {
      return arr;
    }
  });
  return Object.fromEntries(result);
};
