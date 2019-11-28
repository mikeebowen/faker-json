
const faker = require('faker');
const callIf = require('./callIf');

function createData(val, parentKeys, ids = {}) {
  if (typeof val === 'string') {
    return faker.fake(val);
    // TODO: add support for bigint when it becomes available
  } else if (['boolean', 'number', 'undefined', 'symbol'].includes(typeof(val)) || val === null ) {
    return val;
  } else if (typeof(val) === 'object') {
    let count;
    const min = ['string', 'number'].includes(typeof(val.__min)) ? val.__min : false;
    const max = ['string', 'number'].includes(typeof(val.__max)) ? val.__max : false;
    let ret;

    if ((!min || min < 1) && val.__min !== undefined) {
      throw new Error(
        `Aborted: \n__min must be an integer greater than 0 or a string parsable as a number: ${parentKeys}.__min === ${val.__min}`
      );
    }
    if ((!max || max < 1) && val.__max !== undefined) {
      throw new Error(
        `Aborted: \n__max must be an integer greater than 0 or a string parsable as a number: ${parentKeys}.__max === ${val.__max}`
      );
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
      }
    } else {
      count = 0;
    }

    if (count) {
      ret = [];
      for (let i = 0; i < count; i++) {
        // TODO: allow id to accept a function
        const oldId = ids[parentKeys] ? ids[parentKeys] : 0;
        const id = oldId + 1;
        ids[parentKeys] = id;
        if (!Object.hasOwnProperty.call(val, '__useVal')) {
          const newObj = {};

          Object.keys(val).forEach(k => {
            if (!k.startsWith('__')) {
              newObj[k] = createData(callIf(val[k]), `${parentKeys}.${k}`, ids);
            }
          });
          if (val.__id) {
            newObj.id = id;
          }
          ret.push(newObj);
        } else {
          ret.push(createData(callIf(val.__useVal), undefined, ids));
        }
      }
    } else if (Array.isArray(val)) {
      ret = val.map((v, i) => createData(callIf(v), `${parentKeys}[${i}]`, ids));
    } else {
      ret = {};
      Object.keys(val).forEach(k => {
        if (!k.startsWith('__')) {
          ret[k] = createData(callIf(val[k]), `${parentKeys}.${k}`, ids);
        }
      });
      if (Object.hasOwnProperty.call(val, '__id')) {
        ret.id = 1;
      }
    }

    return ret;
  }
}

module.exports = exports = createData;
