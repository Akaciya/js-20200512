/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {

 /* 1 вариант
 return function(arg) {
    const arr = path.split('.');
    for (let item of arr) {
      if (arg !== undefined && Object.keys(arg).indexOf(item) !== -1) {
        arg = arg[item];
      } else {
        return;
      }
    }
    return arg;
  };*/

  return function(arg) {
    const arr = path.split('.');
    for (let item of arr) {
      if (arg === undefined || !arg.hasOwnProperty(item)) {
        return;
      }
      arg=arg[item];
    }
    return arg;
  };
}
