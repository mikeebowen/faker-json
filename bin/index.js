#! /usr/bin/env node

const {join, sep, extname} = require('path');
const {existsSync} = require('fs');
const yargs = require('yargs');
const chalk = require('chalk');
const createFromFile = require('../lib/createFromFile');
const createData = require('../lib/createData');
const parseFilePath = require('../lib/parseFilePath');
const createFile = require('../lib/createFile');
const checkWithUser = require('../lib/checkWithUser');

if (require.main === module) {
  const {file} = yargs.argv;

  if (typeof(file) === 'string' && file != undefined) {
    const readPathArr = file ? file.split(sep) : ['testData.json'];
    readPathArr.unshift(process.cwd());
    const readFileName = readPathArr.pop();
    const ext = extname(readFileName);
    if (ext !== '.js' && ext !== '.json') {
      // eslint-disable-next-line no-console
      console.log(chalk.yellow('File must be javascript (.js) or JSON (.json)'));
      process.exit();
    } else if (ext === '.json') {
      const readPath = `${join(...[...readPathArr, readFileName])}`;
      createFromFile(readPath);
    } else {
      const {savePath: dataPath} = parseFilePath(file, true);
      const data = require(dataPath);
      const {savePathArr, saveFileName, savePath} = parseFilePath(data.__out);
      if (existsSync(savePath)) {
        checkWithUser(`${saveFileName} already exists. Do you want to overwrite it? (y/N)\n`, answer => {
          if (answer === 'y') {
            createFile(savePath, savePathArr, data, true);
          } else {
            // eslint-disable-next-line no-console
            console.log(chalk.yellow('Aborted'));
            process.exit();
          }
        });
      } else {
        createFile(savePath, savePathArr, data, true);
      }
    }
  }
} else {
  module.exports = createData;
}
