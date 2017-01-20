/**
 * 要理解framesToPop，只需要了解以下几个文件就可以了：
 * parseErrorStack-> stacktrace-parser-> parseErrorStack-test
 * 不过还是建议先了解一下js中的Error对象，例如Error对象的message和stack属性，还有Error自身的stackTraceLimit属性
 */

/**
 * https://github.com/facebook/react-native/pull/7030#discussion-diff-61845569
 * 在该URL下的页面中搜索framesToPop，可以看到有人回复了意思大概是这样的一段话：
 * 您可以设置`error.framesToPop = N`来移除打印出来的实际堆栈信息
 */

/**
 *
 */
/*
 "TypeError: You must input a boolean type
 at <anonymous>:1:13"
 */

//var error = new Error('test');

// throw error;

/*

 /Users/cube/Practice/SourceAnalyse/ReactSource/15.3.0/26-React/29-ReactChildren/errorTest.js:5
 throw error;
 ^

 Error: test // Error message

 // stack 程序崩溃出错的时候，最主要看的是这个信息stack，错误堆栈，就是我们可以从错误堆栈里面去找
 // 我们的错误，就是我们的根源是在哪个地方发生的，因为它会告诉我们，它这个错误从哪个函数调用上来的
 // 哪些函数，因为它是一个类似于冒泡，它会把文件的哪个行从哪个字符开始的，都会告诉我们
 // at 后面的内容 就是说明错误对象定义的地方
 at Object.<anonymous> (/Users/cube/Practice/SourceAnalyse/ReactSource/15.3.0/26-React/29-ReactChildren/errorTest.js:3:13)
 at Module._compile (module.js:541:32)
 at Object.Module._extensions..js (module.js:550:10)
 at Module.load (module.js:458:32)
 at tryModuleLoad (module.js:417:12)
 at Function.Module._load (module.js:409:3)
 at Module.runMain (module.js:575:10)
 at run (node.js:348:7)
 at startup (node.js:140:9)
 at node.js:463:3

*/
// 错误信息的行号是错误对象定义的地方，而不是抛出对象的地方
// console.log(error.stack);

// 一个错误包含message
// stack
// 还包含自定义，其实js里面的error就是一个类，就是一个对象，就是也可以往error的对象里面去设置我们
// 需要的一些字段，可能后面要讲的http的错误之类的，有时候我们可能需要一些结构化的数据，比如说我们要把错误的stackCode带上去
// 就可以在错误对象上面加一个code。

// error.code = 401;

// console.dir(Error);

/*
 { [Function: Error]
 captureStackTrace: [Function: captureStackTrace],
 stackTraceLimit: 10 }
*/
// 限制错误堆栈信息的行数
Error.stackTraceLimit = 1;
// 在PREL上可以显示15行的错误信息

var error = new Error('test2');
console.log(error.stack);
// throw error;

// TypeError：类型的错误
// RangeError：数组下标越界
// ReferenceError: Object引用错误，not undefined
// SyntaxError: 语法错误
// 前四个是js错误
// SystemError: 这个是Node.js自己定义的
// 第五个比如说读写文件触发一些底层的错误

// 异常是一个值，而"错误"是通常指的是"类型"
// 当都明确指出是一个值时，"错误"必须是Error类的实例，:"异常"则不是
// 但是所有从node.js以及js中抛出的"异常"，却都是Error类的实例对象

function sum(a, b) {
  if (typeof a !== 'undefined' || typeof b !== 'undefined') {
    throw 'you must specify a and b is number type';
  } else {
    return a + b;
  }
}

// 这样就得到一个异常，其实就是简单的抛出的了一个字符串信息
// 没有错误message、没有错误堆栈

// 在EventEmitter中抛出错误

// EventEmitter：async.js/ Promise.js /async(await)
// 容易忽略错误，造成程序崩溃

// 同步： try-catch
// 异步错误处理的方式：callback

// Express中的错误处理

// winston：会把错误打印到文件或者日志中

class HTTPError extends Error {
  constructor(message, errno, status) {
    super(message);
    this.errno = errno;
    this.status = status;
  }

  toJSON=()=> {
    return JSON.stringify({
      error: {
        errno: this.errno,
        message: this.message,
        stack: this.stack
      }
    });
  }
}

/**
 * 分析一下parseErrorStack
 *
 */

export type StackFrame = {
  file: string, // 哪个文件
  lineNumber: number, // 行号
  column: number // 哪一列
};

var stacktraceParser = require('stacktrace-parser');
// 定义解析错误堆栈，参数是一个Error对象
// 返回值是一个StackFrame类型的数组
function parseErrorStack(e: Error): Array<StackFrame> {
  // 如果对象不存在或者它自身的stack属性不存在，注意stack是js中Error对象自带的属性，而不是自定义的
  if (!e || !e.stack) {
    return [];
  }

  // 判断e.stack是否是数组，如果是的话，直接返回e.stack，
  // 如果不是的话，使用stacktrace-parse的库解析一下
  var stack = Array.isArray(e.stack) ? e.stack : stacktraceParser.parse(e.stack);

  // 如果没有该属性的话，直接返回0，不执行shift操作
  // 如果e.framesToPop等于1，则将最上面的堆栈信息数组弹出一个
  var framesToPop = typeof e.framesToPop === 'number' ? e.framesToPop : 0;
  while (framesToPop--) {
    stack.shift(); //这里会弹出数组中的第一个元素
  }

  return stack;  //返回堆栈信息
}

/**
 * 再看一下stacktrace-parser
 */

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
        // 匹配上之后，开始解析
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
// {file:..., methodName: ..., lineNumber: ..., column: ...}类型的数组
// 可以看到，这个库将错误堆栈信息的每一行进行了解析，都会解析出file文件名，methodName：函数名，lineNumber：行号，column：列号
// 然后将解析出的一个个的对象存到数组中返回
module.exports = StackTraceParser;

/**
 * 从上面这两个库中，我们已经得出了以下错误处理流程：
 * 拿到一个错误对象后，将其stack属性进行解析，将stack中的每一行信息解析成一个对象，存到一个数组中
 * 接着对err.framesToPop进行判断，如果err.framesToPop等于1的话，会移除堆栈信息数组的第一个元素
 * 那第一个元素其实就是Error对象定义的位置信息
 */


/**
 * 接下来看fb给出的test代码
 */

// http://facebook.github.io/jest/
// 这是fb自己出的一个测试库
jest.disableAutomock();

var parseErrorStack = require('parseErrorStack');

// 定义了一个错误生成函数
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

  it('supports framesToPop', function() { // 判断是否支持framesToPop，如果支持的话
    function getWrappedError() { // 写一个包含framesToPop属性的error对象进行测试
      var error = getFakeError();
      error.framesToPop = 1;
      return error;
    }

    // 确保 framesToPop等于1 使其忽略getFakeError
    // Make sure framesToPop == 1 causes it to ignore getFakeError
    // stack frame // 栈帧
    var stack = parseErrorStack(getWrappedError());
    // 这里将会把getFakeError相关的信息移除掉
    // 而堆栈信息的第一个元素就是该当前测试文件的getWrappedError了
    expect(stack[0].methodName).toEqual('getWrappedError');
  });

  // 测试不正确的输入
  it('ignores bad inputs', function() {
    expect(parseErrorStack({})).toEqual([]);
    expect(parseErrorStack(null)).toEqual([]);
  });
});

/**
 * 总结一句
 * err.framesToPop的作用就是将Error对象的关键信息放在堆栈信息的第一行
 */
