'use strict';
const { writeFile } = require('fs');

function createFile(savePath, data) {
  writeFile(savePath, JSON.stringify(data), err => {
    if (err) {
      throw err;
    }
  });
}

module.exports = exports = createFile;
