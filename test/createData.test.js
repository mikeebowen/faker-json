

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');

describe('createData', function() {
  const createData = rewire('../lib/createData');
  createData.__set__({
    faker: {
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
      },
    },
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
        word: '{{lorem.word}}',
      },
    };

    const res = createData(testConfig);

    expect(res.length).to.eql(5);
    res.forEach(r => {
      expect(r.lorem.length).to.eql(4);
    });

    done();
  });

  it('should return an array of the length of __max value if __min is not included', function(done) {
    const testConfig = {
      __max: 5,
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        __max: 4,
        word: '{{lorem.word}}',
      },
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
        word: '{{lorem.word}}',
      },
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

  it('should return an array of items matching __useVal', function(done) {
    const testConfig = {
      __max: 5,
      __min: 1,
      __useVal: '{{name.firstName}}',
    };

    const res = createData(testConfig);

    expect(res.length).to.be.greaterThan(1);
    expect(res.length).to.be.lessThan(6);
    res.forEach(r => {
      expect(r).to.eq('Jorge');
    });

    done();
  });

  it('should return an object if __min and __max are not included', function(done) {
    const testConfig = {
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        word: '{{lorem.word}}',
      },
    };

    const res = createData(testConfig);

    expect(res).to.be.a('object');
    expect(Array.isArray(res)).to.eql(false);
    expect(res.name).to.eql('Jorge');
    expect(res.name).to.eql('Jorge');
    expect(res.noun).to.eql('Database');
    expect(res.verb).to.eql('hacking');

    done();
  });

  it('should return an array of items from faker.js if an array of items is passed', function(done) {
    const testConfig = {
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      list: [
        '{{name.firstName}}',
        'tacocat',
        45,
        true,
        null,
        Symbol('foo'),
      ],
    };

    const res = createData(testConfig);

    expect(res.list.length).to.eql(6);
    expect(res.list[0]).to.eql('Jorge');
    expect(res.list[1]).to.eql('tacocat');
    expect(res.list[2]).to.eql(45);
    expect(res.list[3]).to.eql(true);
    expect(res.list[4]).to.eql(null);
    expect(res.list[5]).to.be('symbol');
    done();
  });

  it('should throw an error if __min is less than 0', function(done) {
    const testConfig = {
      __min: -4,
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        word: '{{lorem.word}}',
      },
    };

    const spy = sinon.spy(createData);
    try {
      spy(testConfig, 'this');
    } catch(err) {
      expect(err.message).to.eql('Aborted: \n__min must be an integer greater than 0 or a string parsable as a number: this.__min === -4');
    }
    expect(spy.threw()).to.eql(true);
    done();
  });

  it('should throw an error if __max is less than 0', function(done) {
    const testConfig = {
      __max: -4,
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        word: '{{lorem.word}}',
      },
    };

    const spy = sinon.spy(createData);
    try {
      spy(testConfig, 'this');
    } catch(err) {
      expect(err.message).to.eql('Aborted: \n__max must be an integer greater than 0 or a string parsable as a number: this.__max === -4');
    }
    expect(spy.threw()).to.eql(true);
    done();
  });

  it('should throw an error if __max is less __min', function(done) {
    const testConfig = {
      name: '{{name.firstName}}',
      noun: '{{hacker.noun}}',
      verb: '{{hacker.verb}}',
      lorem: {
        __max: 1,
        __min: 6,
        word: '{{lorem.word}}',
      },
    };

    const spy = sinon.spy(createData);
    try {
      spy(testConfig, 'this');
    } catch(err) {
      expect(err.message).to.eql('Aborted: \n__min cannot be greater than __max: this.lorem.__min > this.lorem.__max');
    }
    expect(spy.threw()).to.eql(true);
    done();
  });
});
