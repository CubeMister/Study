{
  168:[function(_dereq_,module,exports){
    "use strict";

    /**
     * Allows extraction of a minified key.
     * 允许提取一个缩小的key
     * Let's the build system minify keys without losing the ability to dynamically use key strings as values themselves.
     * 我们构建系统减少key的体积，但是不会失去动态使用key的功能
     * Pass in an object with a single key/val pair and it will return you the string key of that single record.
     * 传递一个对象，只有一对单一的属性k-v，并且它将返回包含字符串key的一条记录。
     * Suppose you want to grab the value for a key 'className' inside of an object.
     * 假设你想要抓住className的值
     * Key/val minification may have aliased that key to be 'xa12'.
     * 缩小的k-v也许会被赋一个别名，xa12
     * keyOf({className: null}) will return 'xa12' in that case.
     * Resolve keys you want to use once at startup time, then reuse those resolutions.
     */

    var keyOf = function keyOf(oneKeyObj) {
      var key;
      for (key in oneKeyObj) { //
        if (!oneKeyObj.hasOwnProperty(key)) {
          continue;
        }
        return key;
      }
      return null;
    };

    module.exports = keyOf;
  },{}]
}
