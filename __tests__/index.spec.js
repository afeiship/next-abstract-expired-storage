(function () {
  const NxAbstractExpiredStorage = require('../src');
  const NxLocalStorage = require('@jswork/next-local-storage');

  jest.setTimeout(6e4);

  describe('NxAbstractExpiredStorage.methods', function () {
    beforeEach(function () {
      const local = new NxLocalStorage('ext');
      local.clear();
    });

    test('normal set/sets/get/gets should worked', () => {
      const exStorage = new NxAbstractExpiredStorage(new NxLocalStorage('ext'));
      exStorage.set('k1', 'v1');
      exStorage.set('k2', 'v2');

      expect(exStorage.get('k1')).toBe('v1');
      expect(exStorage.get('k2')).toBe('v2');
      exStorage.sets({ k3: { value: 'v3' }, k4: { value: 'v3' } });
      expect(exStorage.gets()).toEqual({ k1: 'v1', k2: 'v2', k3: 'v3', k4: 'v3' });
    });

    test('api set/get with expired timestamp', (done) => {
      const exStorage = new NxAbstractExpiredStorage(new NxLocalStorage('ext'));
      exStorage.set('k1', 'v1', 100);
      exStorage.set('k2', 'v2', 200);

      expect(exStorage.get('k1')).toBe('v1');
      expect(exStorage.get('k2')).toBe('v2');

      setTimeout(() => {
        expect(exStorage.gets()).toEqual({ k1: null, k2: null });
        done();
      }, 2e3);
    });

    test('api sets/gets with expired timestamp', (done) => {
      const exStorage = new NxAbstractExpiredStorage(new NxLocalStorage('ext'));
      exStorage.sets({
        k1: { value: 'v1', expired: 100 },
        k2: { value: 'v2', expired: 2e3 }
      });

      setTimeout(() => {
        expect(exStorage.gets()).toEqual({ k1: null, k2: 'v2' });
        expect(exStorage.get('k1')).toBe(null);
        expect(exStorage.get('k2')).toBe('v2');
        done();
      }, 1e3);
    });

    test('timeleft should be number & large than current time', () => {
      const exStorage = new NxAbstractExpiredStorage(new NxLocalStorage('ext'));
      exStorage.set('test1', 'value1', 3e3);
      const timeleft = exStorage.timeleft('test1');
      expect(Math.ceil(timeleft / 1000)).toBe(3);
    });
  });
})();
