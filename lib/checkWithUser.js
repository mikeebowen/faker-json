const {createInterface} = require('readline');

module.exports = function (question, cb) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(question, cb);
};
