/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */

export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  if (size === 0) {
    return '';
  }
  string = string.split('');
  let count = 0;
  for ( let i = 1; i < string.length; i++) {
    if (string[i-1] === string[i]) {
      count++;
      if(count < size) {
        continue;
      }
      string.splice(i, 1);
      i--;
    } else {
      count = 0;
    }
  }
  return string.join('');
}
