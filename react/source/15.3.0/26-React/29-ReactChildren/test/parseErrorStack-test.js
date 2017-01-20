/**
 * https://github.com/facebook/react-native/blob/d363b1f2e2a50a023284ee3c370cba3b7f068978/Libraries/JavaScriptAppEngine/Initialization/__tests__/parseErrorStack-test.js
 */
'use strict';

jest.disableAutomock();

var parseErrorStack = require('parseErrorStack');

function getFakeError() {
  return new Error('Happy Cat');
}

describe('parseErrorStack', function() {

  it('parses error stack', function() {
    var stack = parseErrorStack(getFakeError());
    expect(stack.length).toBeGreaterThan(0);

    var firstFrame = stack[0];
    expect(firstFrame.methodName).toEqual('getFakeError');
    expect(firstFrame.file).toMatch(/parseErrorStack-test\.js$/);
  });

  it('supports framesToPop', function() {
    function getWrappedError() {
      var error = getFakeError();
      error.framesToPop = 1;
      return error;
    }

    // Make sure framesToPop == 1 causes it to ignore getFakeError
    // stack frame
    var stack = parseErrorStack(getWrappedError());
    expect(stack[0].methodName).toEqual('getWrappedError');
  });

  it('ignores bad inputs', function() {
    expect(parseErrorStack({})).toEqual([]);
    expect(parseErrorStack(null)).toEqual([]);
  });
});
