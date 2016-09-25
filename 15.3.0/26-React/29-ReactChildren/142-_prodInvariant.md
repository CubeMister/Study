# 142 - prodInvariant

```javascript
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

```
`KAWD-277`

## reactNative/Libraries/JavaScriptAppEngine/initialization/parseErrorStack.js

```javascript

/**
 * @providesModule parseErrorStack
 * @flow
 */
'use strict';

export type StackFrame = {
  file: string, // 哪个文件
  lineNumber: number, // 行号
  column: number, // 哪一列
};

var stacktraceParser = require('stacktrace-parser');

// 定义解析错误堆栈，参数是一个Error对象
function parseErrorStack(e: Error): Array<StackFrame> {
  // 如果对象不存在或者它自身的stack属性不存在，注意stack是js中Error对象自带的属性，而不是自定义的
  if (!e || !e.stack) {
    return [];
  }

  // 判断e.stack是否是数组，如果是的话，直接返回e.stack，如果不是的话，使用别的库解析一下
  var stack = Array.isArray(e.stack) ? e.stack : stacktraceParser.parse(e.stack);

  // 如果没有该属性的话，直接返回0，不执行shift操作
  var framesToPop = typeof e.framesToPop === 'number' ? e.framesToPop : 0;
  while (framesToPop--) {
    stack.shift(); //这里会弹出数组中的第一个元素，并将该元素作为返回值返回
  }

  return stack; 返回堆栈信息
}

module.exports = parseErrorStack;

```

## stacktrace-parser

```stacktrace-parser
// 未知的函数
var UNKNOWN_FUNCTION = '<unknown>';
// 定义堆栈跟踪解析器
var StackTraceParser = {
  /**
   * 这个对象用来解析不同的堆栈跟踪信息，并且把它们进行一次格式化
   * This parses the different stack traces and puts them into one format
   * 这个很大程度上是借鉴了TraceKit
   * This borrows heavily from TraceKit (https://github.com/occ/TraceKit)
   *
   */
  // 核心方法parse，主要接收一个stackString
  parse: function(stackString) {

   // 首先会以\n进行分离，然后每一部分
    var chrome = /^\s*at (?:(?:(?:Anonymous function)?|((?:\[object object\])?\S+(?: \[as \S+\])?)) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
        gecko = /^(?:\s*([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i,
        node  = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i,
        lines = stackString.split('\n'),
        stack = [],
        parts,
        element;

    for (var i = 0, j = lines.length; i < j; ++i) {
        // 对信息进行挨个匹配
        // 匹配上之后，开始按个解析
        if ((parts = gecko.exec(lines[i]))) {
            element = {
                'file': parts[3],
                'methodName': parts[1] || UNKNOWN_FUNCTION,
                'lineNumber': +parts[4],
                'column': parts[5] ? +parts[5] : null
            };
        } else if ((parts = chrome.exec(lines[i]))) {
            element = {
                'file': parts[2],
                'methodName': parts[1] || UNKNOWN_FUNCTION,
                'lineNumber': +parts[3],
                'column': parts[4] ? +parts[4] : null
            };
        } else if ((parts = node.exec(lines[i]))) {
            element = {
                'file': parts[2],
                'methodName': parts[1] || UNKNOWN_FUNCTION,
                'lineNumber': +parts[3],
                'column': parts[4] ? +parts[4] : null
            };
        } else {
            continue;
        }

        stack.push(element);
    }

    return stack;
  }
};

// 将堆栈信息的每一行进行解析，解析出对应的file名，方法名，行号，列名
{file:..., methodName: ..., lineNumber: ..., column: ...}类型的数组
module.exports = StackTraceParser;

```

```
'use strict';

jest.disableAutomock();

var parseErrorStack = require('parseErrorStack');

function getFakeError() {
  return new Error('Happy Cat');
}

describe('parseErrorStack', function() {
  it('parses error stack', function() { // 创建了一个任务
    var stack = parseErrorStack(getFakeError()); // 得到了stack
    expect(stack.length).toBeGreaterThan(0); // 期望值是stack解析后的长度大于0

    var firstFrame = stack[0]; // 第一帧
    expect(firstFrame.methodName).toEqual('getFakeError'); // 期望第一帧的方法名是getFakeError
    expect(firstFrame.file).toMatch(/parseErrorStack-test\.js$/); //期望错误定义对应的文件是当前文件名
  });

  it('supports framesToPop', function() { // 判断是否支持framesToPop
    function getWrappedError() { // 得到包裹的错误
      var error = getFakeError(); //
      error.framesToPop = 1;
      return error;
    }

    // 确保 framesToPop等于1 使其忽略getFakeError
    // Make sure framesToPop == 1 causes it to ignore getFakeError
    // stack frame // 栈帧
    var stack = parseErrorStack(getWrappedError()); //
    expect(stack[0].methodName).toEqual('getWrappedError');
  });

  it('ignores bad inputs', function() {
    expect(parseErrorStack({})).toEqual([]);
    expect(parseErrorStack(null)).toEqual([]);
  });

});

```
