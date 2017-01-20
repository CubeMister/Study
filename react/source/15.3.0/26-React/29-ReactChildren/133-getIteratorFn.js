{
  133:[function(_dereq_,module,exports){
    /**
     * @providesModule getIteratorFn
     */

    'use strict';

    /* global Symbol */

    // iterator_symbol
    // typeof Symbol === 'function' : 如果Symbol不存在，则typeof Symbol === 'function'返回false
    // iterator_symbol是false
    // 如果是Symbol存在，则它Iterator_symbol将会等于Symbol.iterator
    var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    // faux_iterator_symbol
    // 人为的迭代器symbol
    var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec. //在Symbol之前的文档中是这样写的

    /**
     * 返回可迭代对象中的迭代器方法
     * Returns the iterator method function contained on the iterable object.
     * 确保在上下文中这样调用getIteratorFn方法
     * Be sure to invoke the function with the iterable as context:
     *
     *     var iteratorFn = getIteratorFn(myIterable);
     *     if (iteratorFn) {
     *       var iterator = iteratorFn.call(myIterable);
     *       ...
     *     }
     *
     * @param {?object} maybeIterable
     * @return {?function}
     */
    function getIteratorFn(maybeIterable) {
      // 传入一个也许支持迭代的方法
      // 如果该方法不存在，直接返回maybeIterable的值
      // 如果方法存在，继续判断
      // 如果Symbol存在，在ITERATOR_SYMBOL就是Symbol.iterator，否则的话，就是false, iteratorFn就是false
      // 最后要么返回参数，要么返回maybeIterable的Symbol.iterator属性或者@@iterator属性
      var iteratorFn =
            maybeIterable && (
              ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] ||
                maybeIterable[FAUX_ITERATOR_SYMBOL]
            );

      if (typeof iteratorFn === 'function') {
        return iteratorFn;
      }
    }

    module.exports = getIteratorFn;
  },{}]
}
