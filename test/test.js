var nx = require('next-js-core2');
var NxExpiredStorage = require('../src/next-expired-storage');

test('nx.ExpiredStorage', function(done) {
  var exStorage = new NxExpiredStorage();
  exStorage.set('test1', 'value1', 1);
  exStorage.set('test2', 'value23123', 1);

  console.log(exStorage.get('test1'), exStorage.gets());

  setTimeout(() => {
    // console.log(exStorage.get('test1'), exStorage.engine.gets());
    // console.log(exStorage.clear('test1'), exStorage.gets());
    done();
  }, 2 * 1e3);
});
