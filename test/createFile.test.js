'use strict';
const expect = require('chai').expect;
const rewire = require('rewire');
const sinon = require('sinon');

describe('createFile', function() {
  it('should call makedirp with the joined savePathArr', function(done) {
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      mkdirp(val) {
        expect(val).to.eq('tacocat');
        done();
      },
      join() {
        return 'tacocat';
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json');
  });

  it('should call chalk.red with the error message if makedirp throws an error from CLI', function(done) {
    const createFile = rewire('../lib/createFile.js');
    const chalkSpy = sinon.spy();

    createFile.__set__({
      mkdirp(val, cb) {
        expect(val).to.eq('racecar');
        cb(new Error('out of beer'));
      },
      join() {
        return 'racecar';
      },
      chalk: {
          red: chalkSpy,
          green() {
            return
          }
      },
      writeFile() {
        return;
      },
      process: {
        unmask: process.unmask,
        exit() {
          expect(chalkSpy.calledWithExactly('out of beer')).to.be.true;
          done();
          return;
        }
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', true);
  });

  it('should call chalk.red with the error message if makedirp throws an error from file', function(done) {
    const chalkSpy = sinon.spy();
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      mkdirp(val, cb) {
        expect(val).to.eq('racecar');
        cb(new Error('out of beer'));
      },
      join() {
        return 'racecar';
      },
      chalk: {
          red: chalkSpy,
          green() {
            return
          }
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', false);
    expect(chalkSpy.calledWithExactly('out of beer')).to.be.true;
    done();
  });

  it('should catch the error if createData throws an error from file', function(done) {
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      createData() {
        throw new Error('out of tacos');
      },
      chalk: {
        red(msg) {
          expect(msg).to.eq('out of tacos');
          done();
          return '';
        },
        green() {
          return;
        }
      },
      join() {
        return 'test.json';
      },
      writeFile() {
        return;
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', false);
  });

  it('should catch the error if createData throws an error from CLI', function(done) {
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      createData() {
        throw new Error('out of tacos');
      },
      chalk: {
        red(msg) {
          expect(msg).to.eq('out of tacos');
          return '';
        },
        green() {
          return;
        }
      },
      join() {
        return 'test.json';
      },
      writeFile() {
        return;
      },
      process: {
        unmask: process.unmask,
        exit() {
          done();
        }
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', true);
  });


  it('should catch an error thrown by writeFile from CLI', function(done) {
    const redChalkStub = sinon.stub().returns('');
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      join() {
        return 'test.json';
      },
      writeFile(savePath, data, cb) {
        cb(new Error('too many cats'));
      },
      chalk: {
        red: redChalkStub,
        green() {
          expect(redChalkStub.calledWithExactly('too many cats')).to.be.true;
          done();
          return;
        }
      },
      process: {
        unmask: process.unmask,
        exit() {
          return;
        }
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', true);
  });

  it('should catch an error thrown by writeFile from file', function(done) {
    const redChalkStub = sinon.stub().returns('');
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      join() {
        return 'test.json';
      },
      writeFile(savePath, data, cb) {
        cb(new Error('too many cats'));
        expect(redChalkStub.calledWithExactly('too many cats')).to.be.true;
        done();
      },
      chalk: {
        red: redChalkStub,
        green() {
          return;
        }
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', false);
  });

  it('should log success if the file is successfully created from CLI', function(done) {
    const greenChalkStub = sinon.stub().returns('');
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      writeFile(savePath, data, cb) {
        cb();
      },
      chalk: {
        green: greenChalkStub
      },
      process: {
        unmask: process.unmask,
        exit() {
          expect(greenChalkStub.calledWithExactly('/file/location/test.json created.')).to.be.true;
          done();
          return;
        }
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', true);
  });

  it('should log success if the file is successfully created from file', function(done) {
    const createFile = rewire('../lib/createFile.js');
    createFile.__set__({
      writeFile(savePath, data, cb) {
        cb();
      },
      chalk: {
        green(msg) {
          expect(msg).to.eq('/file/location/test.json created.');
          done();
          return '';
        }
      }
    });

    createFile('/file/location/test.json', ['file', 'location'], 'test.json', false);
  });
});
