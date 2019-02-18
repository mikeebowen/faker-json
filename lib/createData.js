'use strict';
const faker = require('faker');

function createData(val) {
  if (typeof val === 'string' && val.startsWith('{{') && val.endsWith('}}')) {
    return faker.fake(val);
  } else if (['boolean', 'string', 'number'].includes(typeof val) || val == null) {
    return val;
  } else if (typeof val === 'object') {
    const parsedNum = parseInt(val.__count, 10);
    const isNanStatus = isNaN(parsedNum);
    const count = !isNanStatus ? parsedNum : 1;
    let ret;

    if (count > 1) {
      ret = [];
      for (let i = 0; i < count; i++) {
        const newObj = {};

        Object.keys(val).forEach(k => {
          if (!k.startsWith('__')) {
            newObj[k] = createData(val[k]);
          }
        });
        ret.push(newObj);
      }
    } else if (Array.isArray(val)) {
      ret = val.map(v => {
        return createData(v);
      });
    } else {
      ret = {};
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
