var chrome = /^
\s*at (?:(?:(?:Anonymous function)?|((?:\[object object\])?\S+(?: \[as \S+\])?)) )?

\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
\(?

\d 表示匹配一个数字

http://www

(?:file|http|https):
*?:非贪婪模式

.*?
*?
b+

/^ $/i

^ 表示开头
$ 表示结尾

\s：匹配一个空白字符，包括空格、制表符、换页符和换行符
*：表示0次或多次

\s*at：表示以at开头的

(?:(?:(?:Anonymous function)?|((?:\[object object\])?\S+(?: \[as \S+\])?)) )


(?:Anonymous function): 匹配Anonymous function但是不记住匹配项
? 表示匹配0次或者1次

Anonymous function 匹配0次或者1次
或者

((?:\[object object\])?\S+(?: \[as \S+\])?)
[obj obj]?
\S匹配非空白字符

(?: \[as \S+\])

(Anonymous function)?|(([object object])?\S+( [as \S+])?)
(Anonymous function)?
或者
[object object]?\S+( [as \S+])?

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




var chrome = /^\s*at (?:(?:(?:Anonymous function)?|((?:\[object object\])?\S+(?: \[as \S+\])?)) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i,

/*

/^
\s*at (?:
 (?:
 (?:
 Anonymous function
 )?|(
 (?:
 \[object object \]
 )?\S+
 (?:
 \[as \S+\]
 )?
 )
 )
 )?\(?((?:
 file|http|https
 ):.*?):(\d+)(?:
 :(\d+)
 )
)

$/

*/

/* chrome

/^
  \s*at (?:
    (?:
      (?:
        Anonymous function
      )?|(
        (?:
          \[object object\]
        )?\S+(?:
         \[as \S+\]
        )?
      )
    )
  )?\(?(
    (?:
      file|http|https
    ):.*?
  ):(\d+)(?:
    :(\d+)
  )
  ?\)?\s*
$/i

*/

/* gecko
/^
  (?:
    \s*(
      [^@]*
    )(?:
      \((
        .*?
      )\)
    )?@
  )?(
    \S.*?
  ):(\d+)(?:
    :(\d+)
  )?\s*
$/i
*/

/* node

/^
  \s*at (?:
    ((?:
      \[object object\]
    )?\S+(?:
      \[as \S+\]
    )?)
  )?\(?(.*?):(\d+)(?:
    :(\d+)
  )?\)?\s*
$/i

*/

