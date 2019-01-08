(function() {
  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('next-js-core2');
  var NxLocalStorage = nx.LocalStorage || require('next-local-storage');

  var NxExpiredStorage = nx.declare('nx.ExpiredStorage', {
    methods: {
      init: function(inPrefix) {
        var prefix = inPrefix || 'exps';
        this.EXPIRATION_PREFIX = '__nx_expired_storage_ts__';
        this.engine = new NxLocalStorage(prefix);
      },
      set: function(inKey, inValue, inExpiration) {
        this.engine.set(inKey, inValue);
        inExpiration && this.update(inKey, inExpiration);
      },
      get: function(inKey) {
        if (this.expired(inKey)) {
          this.engine.clear(inKey);
          return null;
        }
        return this.engine.get(inKey);
      },
      sets: function(inObject) {
        nx.each(
          inObject,
          function(key, item) {
            this.set(key, item.value, item.expiration);
          },
          this
        );
      },
      gets: function(inKeys) {
        var result = {};
        var keys = Array.isArray(inKeys) ? inKeys : this.__keys();
        nx.each(
          keys,
          function(_, key) {
            result[key] = this.get(key);
          },
          this
        );
        return result;
      },
      clear: function(inKey) {
        this.engine.clears([inKey, this.__key(inKey)]);
      },
      clears: function(inKeys) {
        nx.each(
          inKeys,
          function(_, key) {
            this.clear(key);
          },
          this
        );
      },
      empty: function() {
        this.engine.clears();
      },
      update: function(inKey, inExpiration) {
        this.engine.set(this.__key(inKey), this.timestamp() + inExpiration);
      },
      expired: function(inKey) {
        var timeLeft = this.timeleft(this.__key(inKey));
        return timeLeft !== null && timeLeft <= 0;
      },
      timeleft: function(inKey) {
        var expireTime = parseInt(this.engine.get(inKey));
        if (expireTime && !isNaN(expireTime)) {
          return expireTime - this.timestamp();
        }
        return null;
      },
      timestamp: function() {
        return Math.floor(new Date().getTime() / 1000);
      },
      __key: function(inKey) {
        return this.EXPIRATION_PREFIX + inKey;
      },
      __keys: function() {
        var keys = this.engine.__keys();
        var expirationKey = this.EXPIRATION_PREFIX;
        return keys.filter(function(key) {
          return key.indexOf(expirationKey) === -1;
        });
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxExpiredStorage;
  }
})();
