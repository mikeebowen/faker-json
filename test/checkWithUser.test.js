const {expect} = require('chai');
const rewire = require('rewire');

describe('checkWithUser', function() {
  it('should call the rl.question with the question and callback', function(done) {
    const checkWithUser = rewire('../lib/checkWithUser.js');

    checkWithUser.__set__({
      createInterface() {
        return {
          question(q, cb) {
            expect(q).to.eq('why am I doing this on Saturday morning?');
            expect(cb).to.eq('not a callback');
            done();
          },
        };
      },
    });

    checkWithUser('why am I doing this on Saturday morning?', 'not a callback');
  });
});
