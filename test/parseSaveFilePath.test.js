
const {sep} = require('path');
const expect = require('chai').expect;
const parseSaveFilePath = require('../lib/parseSaveFilePath');

describe('parseSaveFilePath', function() {
  it('should return the save path, save path as an array , and the file name', function(done) {
    const retVal = parseSaveFilePath(`${__dirname + sep}configTestExample.json`);
    expect(retVal.saveFileName).to.eq('configTestExample.json');
    expect(retVal.savePath.includes('faker-json')).to.be.true;
    expect(retVal.savePath.includes('test')).to.be.true;
    expect(retVal.savePath.includes('configTestExample.json')).to.be.true;
    expect(retVal.savePathArr.includes('faker-json')).to.be.true;
    expect(retVal.savePathArr.includes('test')).to.be.true;
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
