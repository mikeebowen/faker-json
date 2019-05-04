'use strict';
const parseSaveFilePath = require('./parseSaveFilePath');
const createFile = require('./createFile');

function createFromCode(data) {
  const { savePathArr, savePath } = parseSaveFilePath(data.__out);  
  createFile(savePath, savePathArr, data);
}

module.exports = createFromCode;
