'use strict';
const faker = require('faker');

function createData(val) {
  if (typeof val === 'string' && val.startsWith('{{') && val.endsWith('}}')) {
    return faker.fake(val);
  } else if (typeof val === 'string' || typeof val === 'number') {
    return val;
  } else if (typeof val == 'object') {
    const parsedNum = parseInt(val.__count, 10);
    const isNanStatus = isNaN(parsedNum);
    const count = !isNanStatus ? parsedNum : 1;
    const ret = isNanStatus ? {} : [];

    if (!isNanStatus) {
      for (let i = 0; i < count; i++) {
        const newObj = {};

        Object.keys(val).forEach(k => {
          if (!k.startsWith('__')) {
            newObj[k] = createData(val[k]);
            ret.push(newObj);
          }
        });
      }
    } else {
      Object.keys(val).forEach(k => {
        if (!k.startsWith('__')) {
          ret[k] = createData(val[k]);
        }
      });
    }

    return ret;
  }
}

module.exports = exports = createData;
