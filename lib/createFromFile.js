'use strict';
const { readFile, mkdir } = require('fs');
const { join } = require('path');
const { random } = require('faker');
const createFile = require('./createFile');
const createData = require('./createData');

function createFromFile(readPath) {
  readFile(readPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const savePathArr =
      typeof parsedData.__out === 'string' ? parsedData.__out.split('/') : [`jfTestData-${random.uuid()}`];
    // const saveFileName = savePathArr[savePathArr.length - 1].endsWith('.json')
    //   ? savePathArr.pop()
    //   : `${savePathArr.pop()}.json`;
    const saveFileName = savePathArr[savePathArr.length - 1].endsWith('.json') ? savePathArr.pop() : `${savePathArr.pop()}.json`;
    const savePath = `${join(...[...savePathArr, saveFileName])}`;

    mkdir(join(...savePathArr), { recursive: true }, err => {
      if (err) {
        throw err;
      }
      createFile(savePath, createData(parsedData));
    });
  });
}

module.exports = exports = createFromFile;
