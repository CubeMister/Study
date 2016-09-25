{
  164:[function(_dereq_,module,exports){

    'use strict';

    /**
     * Use invariant() to assert state which your program assumes to be true.
     * 使用invariant方法来判断你的程序是否正确
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * 提供了sprintf风格的格式化函数，只有%s是被支持的，其中参数提供了一些你所期望的值的信息
     *
     * invariant的信息将在生产环境中去掉，但是invariant仍旧保持代码逻辑在生产环境中不变
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    function invariant(condition, format, a, b, c, d, e, f) {
      // 在dev环境下，必须包含format参数
      if ("development" !== 'production') {
        if (format === undefined) {
          throw new Error('invariant requires an error message argument');
        }
      }

      // 如果条件不成立
      if (!condition) {
        var error;
        if (format === undefined) {
          // dev环境下，可以得到更多错误信息和有帮助的警告
          error = new Error('Minified exception occurred;' +
                            ' use the non-minified dev environment ' +
                            'for the full error message and additional helpful warnings.');
        } else {
          // 替换format中的%s的内容，生成错误信息
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(format.replace(/%s/g, function () {
            return args[argIndex++];
          }));
          error.name = 'Invariant Violation';
        }

        // framesToPop见_prodInvariant
        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    }

    module.exports = invariant;
  },{}]
}
