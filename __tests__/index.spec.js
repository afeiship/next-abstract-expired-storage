(function () {
  const NxAbstractExpiredStorage = require('../src');
  const NxLocalStorage = require('@jswork/next-local-storage');

  describe('NxAbstractExpiredStorage.methods', function () {
    test('get expired api should expired', function (done) {
      var exStorage = new NxAbstractExpiredStorage(new NxLocalStorage('ext'));
      exStorage.set('test1', 'value1', 3e3);
      expect(exStorage.get('test1')).toBe('value1');

      setTimeout(() => {
        expect(exStorage.get('test1')).toBe(null);
        done();
      }, 4e3);
    });

    test('timeleft should be number & large than current time', () => {
      const exStorage = new NxAbstractExpiredStorage(new NxLocalStorage('ext'));
      exStorage.set('test1', 'value1', 3e3);
      const timeleft = exStorage.timeleft('test1');
      expect(Math.ceil(timeleft / 1000)).toBe(3);
    });
  });
})();
