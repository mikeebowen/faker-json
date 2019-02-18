#! /usr/bin/env node
'use strict';
const { join } = require('path');
const yargs = require('yargs');
const createFromFile = require('./lib/createFromFile');

// yargs.array('location');
// Object.keys(faker).forEach(key => {
//   yargs.array(key);
// });

const argv = yargs.argv;

if (typeof argv.file === 'string' && argv.file != undefined) {
  const readPathArr = argv.file ? argv.file.split('/') : ['testData'];
  const readFileName = readPathArr[readPathArr.length - 1].endsWith('.json') ? readPathArr.pop() : `${readPathArr.pop()}.json`;
  const readPath = `${join(...[...readPathArr, readFileName])}`;
  createFromFile(readPath);
}
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
