
const {readFile, existsSync} = require('fs');
const {createInterface} = require('readline');
const chalk = require('chalk');
const createFile = require('./createFile');
const parseSaveFilePath = require('./parseSaveFilePath');

function createFromFile(readPath) {
  readFile(readPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const {savePathArr, saveFileName, savePath} = parseSaveFilePath(parsedData.__out);
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (existsSync(savePath)) {
      rl.question(`${saveFileName} already exists. Do you want to overwrite it? (y/N)\n`, answer => {
        if (answer.toLowerCase() === 'y') {
          createFile(savePath, savePathArr, parsedData, true);
        } else {
          console.warn(chalk.yellow('Aborted'));
          process.exit();
        }
      });
    } else {
      createFile(savePath, savePathArr, parsedData, true);
    }
  });
}

module.exports = exports = createFromFile;
