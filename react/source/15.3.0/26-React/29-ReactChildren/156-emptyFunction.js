{
  156:[function(_dereq_,module,exports){
    "use strict";

    /* 定义一个空函数，返回值是一个返回传入参数的函数 */
    function makeEmptyFunction(arg) {
      return function () {
        return arg;
      };
    }

    /**
     * This function accepts and discards inputs; it has no side effects. This is
     * primarily useful idiomatically for overridable function endpoints which
     * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
     *
     这个函数接收并且丢弃输入，它没有任何的副作用，
     这是主要的有用的，惯用的对于可以覆盖的函数，总是需要被调用，但是js缺乏一个空的调用ala：按...的风格
     类似于Cocoa那样习惯的风格
     该函数可以接收参数，但是不会返回任何内容，它没有逻辑上的功能，
     但是它是有用的，习惯用该函数来对那些总是需要调用的变量进行赋值，但是js一直都缺少一个像Cocooa风格的空函数调用
     */
    var emptyFunction = function emptyFunction() {};

    // 返回一个函数
    emptyFunction.thatReturns = makeEmptyFunction;
    emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction.thatReturnsNull = makeEmptyFunction(null);

   // 返回this指向
    emptyFunction.thatReturnsThis = function () {
      return this;
    };
    // 返回传入的参数
    emptyFunction.thatReturnsArgument = function (arg) {
      return arg;
    };

    module.exports = emptyFunction;
  },{}]
}
