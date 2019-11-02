
const {sep} = require('path');
const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const parsedDataClone = require('./configTestExample.json');

describe('createFromFile', function() {

  it('should call readFile with the file location', function(done) {
    const createFromFile = rewire('../lib/createFromFile.js');
    createFromFile.__set__({
      readFile(val, encoding, cb) {
        expect(val).to.be.a('string');
        expect(val).to.equal('path/to/config/file.js');
        expect(encoding).to.equal('utf8');
        expect(cb).to.be.a('function');
      },
    });

    Promise.resolve(createFromFile('path/to/config/file.js'))
      .then(() => done())
      .catch(err => done(err));
  });

  it('should throw an error if readFile returns an error', function(done) {
    const createFromFile = rewire('../lib/createFromFile.js');
    createFromFile.__set__({
      readFile(val, encoding, cb) {
        return cb(new Error('test error'), null);
      },
    });

    expect(() => createFromFile('path/to/config/file.js')).to.throw('test error');
    done();
  });

  it('should call checkWithUser before calling createFile if checkWithUser calls the callback', function(done) {
    const createFromFile = rewire('../lib/createFromFile.js');
    createFromFile.__set__({
      createFile(savePath, savePathArr, parsedData) {
        expect(parsedData).to.deep.eq(parsedDataClone);
        expect(savePathArr).to.deep.eq(['results', 'data']);
        expect(savePath).to.include('faker-json');
        expect(savePath).to.include('results');
        expect(savePath).to.include('data');
        expect(savePath).to.include('user.json');
        done();
      },
      existsSync() {
        return true;
      },
      checkWithUser(foo, cb) {
        cb('y');
      },
      process: {
        cwd: process.cwd,
        exit() {
          return;
        },
      },
    });

    createFromFile(`${__dirname + sep}configTestExample.json`);
  });

  it('should call checkWithUser before calling createFile if checkWithUser does not call the callback', function(done) {
    const createFromFile = rewire('../lib/createFromFile.js');
    const chalkYellowSpy = sinon.spy();
    createFromFile.__set__({
      existsSync() {
        return true;
      },
      checkWithUser(foo, cb) {
        cb('N');
      },
      chalk: {
        yellow: chalkYellowSpy,
      },
      process: {
        cwd: process.cwd,
        exit() {
          expect(chalkYellowSpy.calledWith('Aborted')).to.be.true;
          done();
        },
      },
    });

    createFromFile(`${__dirname + sep}configTestExample.json`);
  });

  it('should call createFile without checking with the user if existsSync returns false', function(done) {
    const createFromFile = rewire('../lib/createFromFile.js');
    createFromFile.__set__({
      createFile(savePath, savePathArr, parsedData) {
        expect(parsedData).to.deep.eq(parsedDataClone);
        expect(savePathArr).to.deep.eq(['results', 'data']);
        expect(savePath).to.include('faker-json');
        expect(savePath).to.include('results');
        expect(savePath).to.include('data');
        expect(savePath).to.include('user.json');
        done();
      },
      existsSync() {
        return false;
      },
      createInterface() {
        return {
          question(res = 'y', cb) {
            cb('y');
          },
        };
      },
    });

    createFromFile(`${__dirname + sep}configTestExample.json`);
  });
});
