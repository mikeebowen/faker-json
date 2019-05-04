'use strict';
const { random } = require('faker');
const { resolve, join } = require('path');

function parseSaveFilePath(filePath) {
  const savePathArr =
    typeof filePath === 'string'
      ? filePath.split('/')
      : [`jfTestData-${random.uuid()}`];
  const saveFileName = savePathArr[savePathArr.length - 1].endsWith('.json')
    ? savePathArr.pop()
    : `${savePathArr.pop()}.json`;
  const savePath = resolve(process.cwd(), `${join(...[...savePathArr, saveFileName])}`);

  return {savePath, savePathArr, saveFileName };
}

module.exports = parseSaveFilePath;
