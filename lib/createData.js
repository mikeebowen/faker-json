'use strict';
const faker = require('faker');

function createData(val, parentKeys) {
  if (typeof val === 'string' && val.startsWith('{{') && val.endsWith('}}')) {
    return faker.fake(val);
  } else if (['boolean', 'string', 'number'].includes(typeof val) || val == null ) {
    return val;
  } else if (typeof val === 'object') {
    let count;
    const min = ['string', 'number'].includes(typeof val.__min) ? Number(val.__min) : false;
    const max = ['string', 'number'].includes(typeof val.__max) ? Number(val.__max) : false;
    let ret;

    if ((!min || min < 1) && val.__min !== undefined) {
      throw new Error(`Aborted: \n__min must be a an integer greater than 0 or a string parsable as a number: ${parentKeys}.__min === ${val.__min}`);
    }
    if ((!max || max < 1) && val.__max !== undefined) {
      throw new Error(`Aborted: \n__max must be a an integer greater than 0 or a string parsable as a number: ${parentKeys}.__max === ${val.__max}`);
    }
    if (min && max && min > max) {
      throw new Error(`Aborted: \n__min cannot be greater than __max: ${parentKeys}.__min > ${parentKeys}.__max`);
    }

    if (min || max) {

      // if either max or min is NaN then the other must be a number so set count to it otherwise get a random number in between the max and min
      if (!min && max) {
        count = max;
      } else if (!max && min) {
        count = min;
      } else if (max && min) {
        count = Math.random() * (max - min) + min;
      } else {
        count = 1;
      }
    } else {
      count = 0;
    }

    if (count) {
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
