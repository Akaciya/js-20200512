/**
 * Sum - returns sum of arguments if they can be converted to a number
 * @param {number} n value
 * @returns {number | function}
 */
export function sum (n) {
  function foo(x) {
    return sum(n + x);
  }
  foo.valueOf = foo.stringOf = function() {
    return n || 0;
  };
  return foo;
}
