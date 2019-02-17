'use strict';
const { readFile, writeFile } = require('fs');
const { join } = require('path');
const faker = require('faker');

function createItems(val) {
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
          if (k !== '__count') {
            newObj[k] = createItems(val[k]);
            ret.push(newObj);
          }
        });
      }
    } else {
      Object.keys(val).forEach(k => {
        ret[k] = createItems(val[k]);
      });
    }

    return ret;
  }


}

function createFile(argv) {
  const configPath = argv.data;
  const filePath = configPath.split('/');
  const fileName = filePath.pop();

  readFile(`${join(...filePath)}/${fileName}`, 'utf8', (err, data) => {
    const parsedData = JSON.parse(data);
    if (err) {
      throw err;
    }
    
    parsedData.data.forEach((datum, i) => {
      let saveFileName = datum.fileName.endsWith('.json') ? datum.fileName : `testData-${i}.json`;
      const count = datum.__count || 1;
      let ret = count > 1 ? [] : undefined;
      
      if (count > 1) {
        for (let i = 0; i < count; i++) {
          ret.push(createItems(datum.item));
        }
      } else {
        ret = createItems(datum.item);
      }
      console.log(ret);
    });
  });
}

module.exports = exports = createFile;
