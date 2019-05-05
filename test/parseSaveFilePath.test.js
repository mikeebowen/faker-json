'use strict';
const expect = require('chai').expect;
const parseSaveFilePath = require('../lib/parseSaveFilePath');

describe('parseSaveFilePath', function() {
  it('should return the save path, save path as an array , and the file name', function(done) {
    const retVal = parseSaveFilePath(`${__dirname}/configTestExample.json`);
    const compareObj = {
      saveFileName: 'configTestExample.json',
      savePath: '/home/michael/Repositories/json-faker/home/michael/Repositories/json-faker/test/configTestExample.json',
      savePathArr: [
        '',
        'home',
        'michael',
        'Repositories',
        'json-faker',
        'test'
      ]
    };
    expect(retVal).to.deep.eq(compareObj);
    done();
  });

  it('should return jfTestData=[uuid] for a file name if no name is passed', function(done) {
    const retVal = parseSaveFilePath(undefined);
    expect(retVal.saveFileName.startsWith('jfTestData')).to.be.true;
    expect(retVal.savePath.includes('jfTestData')).to.be.true;
    expect(retVal.savePathArr.length).to.eq(0);
    done();
  });
});
