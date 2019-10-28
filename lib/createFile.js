
const mkdirp = require('mkdirp');
const {join} = require('path');
const {writeFile} = require('fs');
const chalk = require('chalk');
const createData = require('./createData');

function createFile(savePath, savePathArr, parsedData, exitProcess) {
  mkdirp(join(...savePathArr), err => {
    if (err) {
      console.error(chalk.red(err.message));
      if (exitProcess) {
        process.exit();
      }
    }
    let data;

    try {
      data = createData(parsedData, 'this');
    } catch (err) {
      console.error(chalk.red(err.message));
      if (exitProcess) {
        process.exit();
      }
    }

    writeFile(savePath, JSON.stringify(data), err => {
      if (err) {
        console.error(chalk.red(err.message));
        if (exitProcess) {
          process.exit();
        }
      }
      // eslint-disable-next-line no-console
      console.log(chalk.green(`${savePath} created.`));
      if (exitProcess) {
        process.exit();
      }
    });
  });
}

module.exports = createFile;
