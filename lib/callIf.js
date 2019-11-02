module.exports = function callIf(fn, ...args) {
  if (typeof fn === 'function') {
    return fn(args);
  }
  return fn;
};
