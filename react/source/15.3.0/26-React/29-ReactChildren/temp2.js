function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  // 判断children的类型
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // 以上情况都会被视为null
    children = null;
  }
  /** children传入的是undefined或者是boolean类型的话，就给children设置null，但是设置null之后，接着就会进入到该if条件中 */
  /** null、string、 number、是一个React元素 */
  /** 子节点可以是undefined、null、string、number、ReactElement */
  if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
    /** 此处只是说children有一个元素 */
    callback(traverseContext, children,
             nameSoFar === '' ? '.' + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0;
  var nextNamePrefix = nameSoFar === '' ? '.' : nameSoFar + ':'; // .

  /** 如果传入的是数组的话 */
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      /** 会给子节点的key增加前缀的 */
      nextName = nextNamePrefix + getComponentKey(child, i);
      /** 此时再调用一次函数本身，将child作为参数传入的话，就会走上面的if条件判断了，并且最后将返回1 */
      /** 也就会计算出子树的数量 subtreeCount */
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  }

  /** 如果是一个迭代器对象的话 */
  else {
    /** 得到迭代器的函数 */
    var iteratorFn = getIteratorFn(children);
    /** 如果迭代器函数 */
    if (iteratorFn) {
      /** 返回迭代器 */
      var iterator = iteratorFn.call(children);
      /** 当前迭代器指针 */
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) { //
          child = step.value; // 取出当前迭代的值
          nextName = nextNamePrefix + getComponentKey(child, ii++); // 生成key
          /** 记录迭代的次数 */
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      }
      else {
        /** 迭代器将会提供entry格式的值 */
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    }
    /** 迭代器迭代结束 */
    else if (type === 'object') {
      var addendum = '';
      var childrenString = String(children);
      !false ?
        isDev ?
        invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _
      prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum)
      : void 0;
      // 如果返回的是一个childrenString，则抛出错误
    }
  }

  return subtreeCount; /** 最后返回子节点的个数 */
}


