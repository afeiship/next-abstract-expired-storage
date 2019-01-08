(function() {
  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('next-js-core2');

  var NxExpiredStorage = nx.declare('nx.ExpiredStorage', {});

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxExpiredStorage;
  }
})();
