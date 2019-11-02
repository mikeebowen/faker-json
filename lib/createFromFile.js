
const {readFile, existsSync} = require('fs');
const createFile = require('./createFile');
const parseFilePath = require('./parseFilePath');
const checkWithUser = require('./checkWithUser');
const chalk = require('chalk');

function createFromFile(readPath) {
  readFile(readPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const {savePathArr, saveFileName, savePath} = parseFilePath(parsedData.__out);

    if (existsSync(savePath)) {
      checkWithUser(`${saveFileName} already exists. Do you want to overwrite it? (y/N)\n`, answer => {
        if (answer === 'y') {
          createFile(savePath, savePathArr, parsedData, true);
        } else {
          // eslint-disable-next-line no-console
          console.log(chalk.yellow('Aborted'));
          process.exit();
        }
      });
    } else {
      createFile(savePath, savePathArr, parsedData, true);
    }
  });
}

module.exports = exports = createFromFile;
