{
  175:[function(_dereq_,module,exports){
    'use strict';
    /* eslint-disable no-unused-vars */
    /* eslint 关闭：没有未使用的变量 */
    /* eslint-disable: 临时关闭eslint校验 */

    /**
     * 是用来判断一个对象是否有你给出名称的属性或对象
     * 不过需要注意的是，此方法无法检查该对象的原型链中是否具有该属性
     * 该属性必须是对象本身的一个成员
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * propertyIsEnumerable()是用来检测属性是否属于某个对象的
     * 如果检测到了,返回true,否则返回false.
     * 这个属性必须属于实例的,并且不属于原型.
     * 这个属性必须是可枚举的,也就是自定义的属性,可以通过for..in循环出来的.
     * 只要符合上面两个要求,就会返回true;
     */
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    /**
     * 将传入的内容转换为Object
     */
    function toObject(val) {
      if (val === null || val === undefined) {
        // 则抛出类型错误：TypeError：类型错误，Object.assign不能被null或者undefined调用
        throw new TypeError('Object.assign cannot be called with null or undefined');
      }

      return Object(val);
    }

    /**
     * 是否应该使用原生
     */
    function shouldUseNative() {
      try {
        // 如果不存在，直接返回false
        if (!Object.assign) {
          return false;
        }

        // Detect buggy property enumeration order in older V8 versions.'';
        // 在旧的v8版本中，检测属性枚举顺序bug
        // https://bugs.chromium.org/p/v8/issues/detail?id=4118
        var test1 = new String('abc');  // eslint-disable-line // 该行关闭eslint校验
        test1[5] = 'de';
        // 返回对象自己(非原型继承的属性)的属性名称，包括函数
        if (Object.getOwnPropertyNames(test1)[0] === '5') { // 正常应该返回0
          return false;
        }

        // 测试一下这个bug
        // 使用String.fromCharCode转换数字，然后作为对象的属性进行设置
        // 之后再逆向的解出来，如果发现和原来的不一样，则返回false
        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2['_' + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
          return test2[n];
        });
        if (order2.join('') !== '0123456789') {
          return false;
        }

        // https://bugs.chromium.org/p/v8/issues/detail?id=3056
        var test3 = {};
        'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
          test3[letter] = letter;
        });
        // Object.keys 只收集自身属性名，不收集继承自原型链上的
        if (Object.keys(Object.assign({}, test3)).join('') !==
            'abcdefghijklmnopqrst') {
          return false;
        }

        return true;
      } catch (e) {
        // 我们不希望上述的任何错误出现，但是还是要进行安全的检测
        // We don't expect any of the above to throw, but better to be safe.
        return false;
      }
    }

    // 调用shouldUseNative：如果返回true，
    module.exports = shouldUseNative() ? Object.assign : function (target, source) {
      var from;
      var to = toObject(target);
      var symbols;

      // 实现的assign函数可以一次性合并多个对象
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);

        for (var key in from) {
          // 为什么要这样用，参考：http://www.cnblogs.com/sanshi/archive/2011/03/15/1985344.html
          // 使用call调用是为了防止对象自身定义的hasOwnProperty同名函数覆盖了原生的函数
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }

        if (Object.getOwnPropertySymbols) {
          // 得到当前对象上定义的symbol类型的属性
          symbols = Object.getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  },{}]
}

// http://www.cnblogs.com/rubylouvre/archive/2011/12/24/2299860.html
