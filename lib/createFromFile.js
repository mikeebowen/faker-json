'use strict';
const { readFile, mkdir, writeFile, existsSync } = require('fs');
const { join } = require('path');
const { createInterface } = require('readline');
const { random } = require('faker');
const chalk = require('chalk');
const createData = require('./createData');

function createFile(savePath, savePathArr, parsedData) {
  mkdir(join(...savePathArr), { recursive: true }, err => {
    if (err) {
      console.error(chalk.red(err.message));
      process.exit();
    }
    let data;

    try {
      data = createData(parsedData, 'this');
    } catch (err) {
      console.error(chalk.red(err.message));
      process.exit();
    }

    writeFile(savePath, JSON.stringify(data), err => {
      if (err) {
        console.error(chalk.red(err.message));
        process.exit();
      }
      console.log(chalk.green(`${join(__dirname, savePath)} created.`));
      process.exit();
    });
  });
}

function createFromFile(readPath) {
  readFile(readPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const savePathArr = typeof parsedData.__out === 'string' ? parsedData.__out.split('/') : [`jfTestData-${random.uuid()}`];
    const saveFileName = savePathArr[savePathArr.length - 1].endsWith('.json') ? savePathArr.pop() : `${savePathArr.pop()}.json`;
    const savePath = `${join(...[...savePathArr, saveFileName])}`;
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
