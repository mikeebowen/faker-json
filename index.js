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
  readPathArr.unshift(process.cwd());
  const readFileName = readPathArr[readPathArr.length - 1].endsWith('.json') ? readPathArr.pop() : `${readPathArr.pop()}.json`;
  const readPath = `${join(...[...readPathArr, readFileName])}`;
  createFromFile(readPath);
}
