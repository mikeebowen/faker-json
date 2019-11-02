const callIf = require('../lib/callIf');
const {expect} = require('chai');

describe('callIf', function() {
  it('should return the results of a function if a function is passes', function(done) {
    const testParams = ['foo', 'bar'];
    function testFunc(params) {
      return 'tacocat';
    }

    const testRes = callIf(testFunc);
    expect(testRes).to.eq('tacocat');
    done();
  });

  it('should return the value if it is not a function', function(done) {
    const testRes = callIf('baz');
    expect(testRes).to.eq('baz');
    done();
  });
});
