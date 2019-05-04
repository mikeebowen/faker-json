'use strict';
const { readFile, existsSync } = require('fs');
const { join, resolve } = require('path');
const { createInterface } = require('readline');
const { random } = require('faker');
const chalk = require('chalk');
const createFile = require('./createFile');

function createFromFile(readPath) {
  readFile(readPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const savePathArr = typeof parsedData.__out === 'string' ? parsedData.__out.split('/') : [`jfTestData-${random.uuid()}`];
    const saveFileName = savePathArr[savePathArr.length - 1].endsWith('.json') ? savePathArr.pop() : `${savePathArr.pop()}.json`;
    const savePath = resolve(process.cwd(), `${join(...[...savePathArr, saveFileName])}`);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    if (existsSync(savePath)) {
      rl.question(`${saveFileName} already exists. Do you want to overwrite it? (y/N)\n`, answer => {
        if (answer.toLowerCase() === 'y') {
          createFile(savePath, savePathArr, parsedData);
        } else {
          console.warn(chalk.yellow('Aborted'));
          process.exit();
        }
      });
    } else {
      createFile(savePath, savePathArr, parsedData);
    }
  });
}

module.exports = exports = createFromFile;
