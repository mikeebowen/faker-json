'use strict';
const { readFile, mkdir, writeFile } = require('fs');
const { join } = require('path');
const { random } = require('faker');
const createData = require('./createData');

function createFromFile(readPath) {
  readFile(readPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const savePathArr =
      typeof parsedData.__out === 'string' ? parsedData.__out.split('/') : [`jfTestData-${random.uuid()}`];
    const saveFileName = savePathArr[savePathArr.length - 1].endsWith('.json') ? savePathArr.pop() : `${savePathArr.pop()}.json`;
    const savePath = `${join(...[...savePathArr, saveFileName])}`;

    mkdir(join(...savePathArr), { recursive: true }, err => {
      if (err) {
        throw err;
      }

      writeFile(savePath, JSON.stringify(createData(parsedData, 'this')), err => {
        if (err) {
          throw err;
        }
      });
    });
  });
}

module.exports = exports = createFromFile;
