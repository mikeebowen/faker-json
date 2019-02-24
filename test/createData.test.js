'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('createData', function() {
  const fakerStub = {
    fake(str) {
      switch (str) {
        case '{{name.firstName}}':
          return 'Jorge';
        case '{{hacker.noun}}':
          return 'Database';
        case '{{hacker.verb}}':
          return 'hacking';
        case '{{lorem.word}}':
          return 'aqua';
        default:
          return str;
      }
    }
  };
  const createData = proxyquire('../lib/createData', {
    faker: fakerStub
  });

  it('should return the faker.js string if it is passed a string as the first argument', function(done) {
    expect(createData('{{name.firstName}}', 'this')).to.eql('Jorge');
    done();
  });

  it('should return the string, number, boolean, or null (if the string is not a valid faker.js string)', function(done) {
    expect(createData('hello world')).to.eql('hello world');
    expect(createData(12)).to.eql(12);
    expect(createData(true)).to.be.a('boolean');
    expect(createData(true)).to.eql(true);
    expect(createData(null)).to.eql(null);
    done();
  });

  it('should return an array of the length of __min value if __max is not included', function(done) {
    const testConfig = {
      __min: 5,
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        __min: 4,
        word: '{{lorem.word}}'
      }
    };

    const res = createData(testConfig);

    expect(res.length).to.eql(5);
    res.forEach(r => {
      expect(r.lorem.length).to.eql(4);
    });

    done();
  });

  it('should return an array of the length of __max value if __max is not included', function(done) {
    const testConfig = {
      __max: 5,
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        __max: 4,
        word: '{{lorem.word}}'
      }
    };

    const res = createData(testConfig);

    expect(res.length).to.eql(5);
    res.forEach(r => {
      expect(r.lorem.length).to.eql(4);
      expect(r.name).to.eql('Jorge');
      expect(r.noun).to.eql('Database');
      expect(r.verb).to.eql('hacking');
    });

    done();
  });

  it('should return a number of items below __min and __max', function(done) {
    const testConfig = {
      __max: 5,
      __min: 1,
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        __max: 4,
        __min:1,
        word: '{{lorem.word}}'
      }
    };

    const res = createData(testConfig);

    expect(res.length).to.be.greaterThan(1);
    expect(res.length).to.be.lessThan(6);
    res.forEach(r => {
      expect(r.lorem.length).to.be.greaterThan(1);
      expect(r.lorem.length).to.be.lessThan(5);
      expect(r.name).to.eql('Jorge');
      expect(r.noun).to.eql('Database');
      expect(r.verb).to.eql('hacking');
    });

    done();
  });
});
