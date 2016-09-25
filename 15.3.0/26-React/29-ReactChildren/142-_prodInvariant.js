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
      var argCount = arguments.length - 1; // 为后面提取出了后面的错误信息

      // 错误信息
      // 压缩React错误 #${code}
      // 访问URL来获取完整的信息或者使用不经过压缩的dev开发环境来获取完整的错误和额外的帮助警告
      var message = 'Minified React error #' +
            code + '; visit ' +
            'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

      // 取出参数中传入的错误信息，进行URI编码后，拼接成URI参数
      for (var argIdx = 0; argIdx < argCount; argIdx++) {
        // encodeURIComponent() 函数可把字符串作为 URI 组件进行编码
        // 注意 encodeURI和encodeURIComponent的区别是： encodeURIComponent() 函数将转义用于分隔 URI 各个部分的标点符号
        // 例如：;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号
        message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
      }

      message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

      // 这里创建并抛出错误
      var error = new Error(message);
      // 这里指定的名字是Invariant Violation：中文翻译过来就是"不变的违反"
      // 这里猜测由于React使用了Immutable库，Immutable本来就是不可变的意思
      // 所以，这里可能是用户修改了不可改变的值
      error.name = 'Invariant Violation';
      // 弹出一个error的栈帧
      // we don't care about reactProdInvariant's own frame
      // 注意这里有这样一条注释，大概意思是，我们并不关心reactProdInvariant函数它自己的栈帧
      // 我们只关心调用reactProdInvariant函数的位置和相关信息
      // 这里framesToPop弹出一个error的栈帧
      // 当错误发生时，第一条stack信息就是reactProdInvariant自身的帧栈信息
      // 第二条才是调用reactProdInvariant的帧栈信息，而reactProdInvariant函数只是用来生成异常并进行抛出的
      // 所以我们需要的异常提示信息应该是调用reactProdInvariant的地方，也就是stack的第二行，所以这里要弹出一个栈帧信息
      // 告诉我们错误真正发生的地方
      // 更多解析见framesToPopTest.js
      error.framesToPop = 1;
      throw error;
    }

    module.exports = reactProdInvariant;
  },{}]
}
