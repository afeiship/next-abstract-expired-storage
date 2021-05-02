(function () {
  // https://github.com/RonenNess/ExpiredStorage
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var EXPIRATION_PREFIX = '__nx_expired_storage_ts__';

  var NxAbstractExpiredStorage = nx.declare('nx.AbstractExpiredStorage', {
    methods: {
      init: function (inEngine) {
        this.engine = inEngine;
      },
      set: function (inKey, inValue, inExpiration) {
        this.engine.set(inKey, inValue);
        inExpiration && this.update(inKey, inExpiration);
      },
      get: function (inKey) {
        if (this.isExpired(inKey)) {
          this.engine.set(inKey, null);
          return null;
        }
        return this.engine.get(inKey);
      },
      sets: function (inObject) {
        nx.each(
          inObject,
          function (key, item) {
            this.set(key, item.value, item.expired);
          },
          this
        );
      },
      gets: function (inKeys) {
        var result = {};
        var keys = Array.isArray(inKeys) ? inKeys : this.__keys();
        nx.each(
          keys,
          function (_, key) {
            result[key] = this.get(key);
          },
          this
        );
        return result;
      },
      del: function (inKey) {
        this.engine.dels([inKey, this.__key(inKey)]);
      },
      dels: function (inKeys) {
        nx.each(
          inKeys,
          function (_, key) {
            this.clear(key);
          },
          this
        );
      },
      clear: function () {
        this.engine.empty();
      },
      update: function (inKey, inExpiration) {
        this.engine.set(this.__key(inKey), Date.now() + inExpiration);
      },
      at: function (inKey) {
        var value = this.get(inKey);
        var expired = parseInt(this.engine.get(this.__key(inKey)), 10);
        return { value: value, expired: expired };
      },
      isExpired: function (inKey) {
        var timeLeft = this.timeleft(inKey);
        return timeLeft !== null && timeLeft <= 0;
      },
      timeleft: function (inKey) {
        var expiredTime = parseInt(this.engine.get(this.__key(inKey)));
        if (expiredTime && !isNaN(expiredTime)) {
          return expiredTime - Date.now();
        }
        return null;
      },
      __key: function (inKey) {
        return EXPIRATION_PREFIX + inKey;
      },
      __keys: function () {
        var keys = this.engine.__keys();
        return keys.filter(function (key) {
          return key.indexOf(EXPIRATION_PREFIX) === -1;
        });
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxAbstractExpiredStorage;
  }
})();
