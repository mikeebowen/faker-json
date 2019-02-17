#! /usr/bin/env node
'use strict';
const { writeFile, mkdir, readFile } = require('fs');
const { join } = require('path');
const faker = require('faker');
const yargs = require('yargs');

// yargs.array('location');
// Object.keys(faker).forEach(key => {
//   yargs.array(key);
// });

const argv = yargs.argv;
// const count = isNaN(argv.count) ? 1 : argv.count;
// const useData = argv.data === 'false' ? false : true;
// let data = count > 1 ? [] : undefined;
// const fileName = argv.location.length
//   ? `${argv.location.pop()}.json`
//   : 'testData.json';
// const filePath = argv.location ? join(...argv.location) : '.';

// mkdir(filePath, { recursive: true }, err => {
//   if (err) {
//     throw err;
//   }

//   for (let i = 0; i < count; i++) {
//     const d = {};
//     Object.keys(argv).forEach(key => {
//       if (Array.isArray(argv[key]) && key !== '_') {
//         argv[key].forEach(k => {
//           if (faker[key] && typeof faker[key][k] === 'function') {
//             d[key] = d[key] == null ? {} : d[key];
//             d[key][k] = faker[key][k]();
//           }
//         });
//         if (Object.keys(d).length) {
//           if (Array.isArray(data)) {
//             data.push(d);
//           } else {
//             data = d;
//           }
//         }
//       }
//     });
//   }

//   const jsonData = !useData ? JSON.stringify(data) : JSON.stringify({ data });

//   writeFile(`${filePath}/${fileName}`, jsonData, err => {
//     if (err) {
//       throw err;
//     }
//   });
// });

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
    const count = datum.count || 1;
    let ret = count > 1 ? [] : undefined;
    
    for (let i = 0; i < count; i++) {
      ret.push(createItems(datum.item));
    }
    console.log(JSON.stringify(ret[0]));
  });
});
