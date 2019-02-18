'use strict';
const faker = require('faker');

function createData(val, parentKeys) {
  if (typeof val === 'string' && val.startsWith('{{') && val.endsWith('}}')) {
    return faker.fake(val);
  } else if (['boolean', 'string', 'number'].includes(typeof val) || val == null) {
    return val;
  } else if (typeof val === 'object') {
    let count;
    const min = parseInt(val.__min, 10);
    const max = parseInt(val.__max, 10);
    let ret;

    if ((!isNaN(min) && typeof min === 'number') || (!isNaN(max) && typeof max === 'number')) {
      if (min < 1 || max < 1) {
        console.error('min and max must both be integers greater than 1: ' + parentKeys);
        process.exit();
      } else {
        // if either max or min is NaN then the other must be a number so set count to it otherwise get a random number in between the max and min
        if (isNaN(min)) {
          count = max;
        } else if (isNaN(max)) {
          count = min;
        } else {
          count = Math.random() * (max - min) + min;
        }
      }
    } else {
      count = 1;
    }

    if (count > 1) {
      ret = [];
      for (let i = 0; i < count; i++) {
        const newObj = {};

        Object.keys(val).forEach(k => {
          if (!k.startsWith('__')) {
            newObj[k] = createData(val[k], `${parentKeys}.${k}`);
          }
        });
        ret.push(newObj);
      }
    } else if (Array.isArray(val)) {
      ret = val.map((v, i) => {
        return createData(v, `${parentKeys}[${i}]`);
      });
    } else {
      ret = {};
      Object.keys(val).forEach(k => {
        if (!k.startsWith('__')) {
          ret[k] = createData(val[k], `${parentKeys}.${k}`);
        }
      });
    }

    return ret;
  }
}

module.exports = exports = createData;
