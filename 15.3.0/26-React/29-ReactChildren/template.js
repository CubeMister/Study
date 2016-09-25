{142:[function(_dereq_,module,exports){

// 该模块专门用于react线上生产环境使用production

/**
 * @providesModule reactProdInvariant
 */

'use strict';

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

/*
 警告：
 不要自己手动去依赖该模块
 该模块是invariant的代替品，该模块是错误码系统需要使用的，它只是在通过babel进行转换时是必须的
 它总是会抛出错误的

 为啥起这个名字，是因为React使用了Immutable，Immutable本来就是不可改变的意思，这里Invariant Violation

 这个Invariant.js的作用就是构建了一个类似iOS中NSAssert的东西
*/

function reactProdInvariant(code) {
  // 该方法可以接收很多参数，只有第一个是必须的
  var argCount = arguments.length - 1;

  // 错误码的信息
  // 压缩React错误 # ... ; 访问URL来获取完整的信息或者使用不经过压缩的dev开发环境来获取完整的错误和额外的帮助警告
  var message = 'Minified React error #' +
        code + '; visit ' +
        'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  // 拼接函数传入的其他错误信息
  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

  // 抛出错误
  var error = new Error(message);
  error.name = 'Invariant Violation';
//  Looks like a neat fb extension, will add this.
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

module.exports = reactProdInvariant;
},{}]

// 您可以设置error.framesToPop = N来移除打印出来的实际堆栈信息
 // https://github.com/facebook/react-native/pull/7030#discussion-diff-61845569

// https://github.com/facebook/react-native/pull/7459

// https://github.com/facebook/react-native/pull/7030


/**

 node_modules/react-native/Libraries/JavaScriptAppEngine/Initialization/parseErrorStack.js:30
 30:   while (framesToPop--) {
 ^^^^^^^^^^^ property `framesToPop` of unknown type. This type is incompatible with
 30:   while (framesToPop--) {
 ^^^^^^^^^^^^^ number

 https://github.com/facebook/react-native/pull/7459

 EDIT: actually, upon reflection, this shouldn't be needed. You'll get a stack trace :D, and invariant sets error.framesToPop = 1.

 https://github.com/facebook/react-native/blob/85a6f011b6e4d9f86bc82437c88273f4cc2782d3/Libraries/JavaScriptAppEngine/Initialization/parseErrorStack.js

 https://github.com/HostACoder/iOS/blob/baecf262f3cd9de33e994181d7a475984ee58912/Pods/React/Libraries/JavaScriptAppEngine/Initialization/parseErrorStack.js
 https://github.com/cnits/cnit/blob/2fac1c32dfc6780881ec3d75c933ffce78dc4131/lib/bower_components/react-native/Libraries/JavaScriptAppEngine/Initialization/parseErrorStack.js
 https://github.com/reactsuper/react-native-source/blob/d54c70f2e1903e7b80a3ecdd4294fe1981a02bc7/sources/ios/errorToString.js
**/
