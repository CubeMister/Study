/**
 * url: https://github.com/facebook/react-native/blob/85a6f011b6e4d9f86bc82437c88273f4cc2782d3/Libraries/JavaScriptAppEngine/Initialization/parseErrorStack.js
 * @providesModule parseErrorStack
 * @flow
 */
'use strict';

export type StackFrame = {
  file: string;
  lineNumber: number;
  column: number;
};

var stacktraceParser = require('stacktrace-parser');

function parseErrorStack(e: Error): Array<StackFrame> {
  if (!e || !e.stack) {
    return [];
  }

  var stack = Array.isArray(e.stack) ? e.stack : stacktraceParser.parse(e.stack);

  var framesToPop = e.framesToPop || 0;
  while (framesToPop--) {
    stack.shift();
  }

  return stack;
}

module.exports = parseErrorStack;
