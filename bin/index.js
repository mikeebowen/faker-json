#! /usr/bin/env node

const {join} = require('path');
const yargs = require('yargs');
const createFromFile = require('../lib/createFromFile');
const createData = require('../lib/createData');

if (require.main === module) {
  const argv = yargs.argv;

  if (typeof argv.file === 'string' && argv.file != undefined) {
    const readPathArr = argv.file ? argv.file.split('/') : ['testData'];
    readPathArr.unshift(process.cwd());
    const readFileName = readPathArr[readPathArr.length - 1].endsWith('.json')
      ? readPathArr.pop()
      : `${readPathArr.pop()}.json`;
    const readPath = `${join(...[...readPathArr, readFileName])}`;
    createFromFile(readPath);
  }
} else {
  module.exports = createData;
}
