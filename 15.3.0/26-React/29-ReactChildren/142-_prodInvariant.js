{
  142:[function(_dereq_,module,exports){
    /**
     * 该模块是专门用于react线上production环境下使用的
     * @providesModule reactProdInvariant
     */
    'use strict';

    /**
     * WARNING: DO NOT manually require this module.
     * 注意：不要手动的去依赖该模块
     * This is a replacement for `invariant(...)` used by the error code system
     * 在错误处理过程中，该模块用于替代invariant模块，并且只是在babel转换时才引入的模块
     * and will _only_ be required by the corresponding babel pass.
     * 它一直抛出错误
     * It always throws.
     */

    function reactProdInvariant(code) {
      var argCount = arguments.length - 1;

      var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

      for (var argIdx = 0; argIdx < argCount; argIdx++) {
        message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
      }

      message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

      var error = new Error(message);
      error.name = 'Invariant Violation';
      // 帧栈弹出
      error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

      throw error;
    }

    module.exports = reactProdInvariant;
  },{}]
}
