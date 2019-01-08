(function () {
  var assert = require('assert');
  var nx = require('next-js-core2');
  var NxExpiredStorage = require('../src/next-expired-storage');

  describe('NxExpiredStorage.methods', function () {
    it('json/urlencoded', function () {
      var data = {
        key: 1,
        value: 2
      };
      // console.log(rs1, rs2);

      // assert.equal(rs1, '{"key":1,"value":2}');
      // assert.equal(rs2, 'key=1&value=2');

    });
  });


}());
