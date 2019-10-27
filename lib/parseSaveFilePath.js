'use strict';
const { random } = require('faker');
const { resolve, join, sep, normalize } = require('path');

function parseSaveFilePath(filePath) {
  const savePathArr =
    typeof filePath === 'string'
      ? normalize(filePath).split(sep)
      : [`jfTestData-${random.uuid()}`];
  const saveFileName = savePathArr[savePathArr.length - 1].endsWith('.json')
    ? savePathArr.pop()
    : `${savePathArr.pop()}.json`;
  const savePath = resolve(process.cwd(), `${join(...[...savePathArr, saveFileName])}`);

  return {savePath, savePathArr, saveFileName };
}

module.exports = parseSaveFilePath;
