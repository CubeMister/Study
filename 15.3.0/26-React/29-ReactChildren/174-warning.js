{
  174:[function(_dereq_,module,exports){

    // 注意：在该方法中，虽然会new Error对象，但是并不会throw它，而是作为错误打印出来
    // console.error

    'use strict';
    var emptyFunction = _dereq_(156);

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * 类似于invariant方法，但是该方法只是在条件不满足的时候，用来打印警告日志的
     * This can be used to log issues in development environments in critical
     * paths.
     * 该函数可以被用来在开发环境下在关键的位置打印问题日志
     * Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     * 通过对dev环境的判断，即使在线上生产环境下也将会保持相同的逻辑并且代码的位置信息也是不变的
     */

    // 空函数的赋值
    var warning = emptyFunction;
    var isDev = "development" !== 'production';

    // dev环境下
    if (isDev) {
      // 定义警告函数，接收两个参数，条件和格式
      warning = function warning(condition, format) {
        //创建指定数量的undefined元素，Array传入的参数是0的话，就是空数组[]
        for (var _len = arguments.length,
              args = Array(_len > 2 ? _len - 2 : 0),
              _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key]; // 得到format需要的参数
        }

        // 必须传入format参数
        if (format === undefined) {
          // warning方法需要一个警告信息参数
          throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
        }

        // 忽略复合组件proptype的检查
        if (format.indexOf('Failed Composite propType: ') === 0) {
          return; // Ignore CompositeComponent proptype check.
        }

        // 如果条件不满足
        if (!condition) {
          var argIndex = 0;
          // 替换format中的%s参数，生成完整的信息
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });
          // 如果console对象存在，则将warning进行打印，例如：IE浏览器就没有console对象
          if (typeof console !== 'undefined') {
            console.error(message);
          }

          try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            // --- 欢迎调试React ---
            // 为了方便起见，这个错误被抛出，你可以使用这个错误的堆栈信息来找到导致警告发生的调用位置
            throw new Error(message);
          } catch (x) {}
        }
      };
    }

    module.exports = warning;
  },{"156":156}]
}
