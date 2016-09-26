{
  147:[function(_dereq_,module,exports){
    /**
     * @providesModule traverseAllChildren
     */

    'use strict';

    var _prodInvariant = _dereq_(142);
    var ReactCurrentOwner = _dereq_(37);
    var ReactElement = _dereq_(63);

    var getIteratorFn = _dereq_(133);
    var invariant = _dereq_(164);
    var KeyEscapeUtils = _dereq_(23);
    var warning = _dereq_(174);
    var isDev = "development" !== 'production';

    // separator分隔符
    var SEPARATOR = '.';
    // subseparator 子分隔符
    var SUBSEPARATOR = ':';

    /**
     * TODO: Test that a single child and an array with one item have the same key
     * pattern.
     * 一个单一的子元素和一个元素的数组有相同的key模式
     */

    // 关于集合的警告
    var didWarnAboutMaps = false;

    /**
     * Generate a key string that identifies a component within a set.
     * 在set集合中，生成一个key字符串来标识一个组件
     * @param {*} component A component that could contain a manual key.
     * 可能包含一个人为添加key的组件
     * @param {number} index Index that is used if a manual key is not provided.
     * 如果没有提供人为添加的key，则使用索引值
     * @return {string}
     */
    /** 得到组件的key */
    function getComponentKey(component, index) {
      // Do some typechecking here since we call this blindly.
      /** 这里将做一些类型检查，因为我们将要不进行检查的调用组件 */
      // We want to ensure that we don't block potential future ES APIs.
      /** 我们要确保不会限制未来的ES API*/
      if (component && typeof component === 'object' && component.key != null) {
        // Explicit key
        /** 显式的key */
        return KeyEscapeUtils.escape(component.key);
      }
      // Implicit key determined by the index in the set
      /** js的toString方法，支持的进制是2-36之间，(35).toString(36) === 'z'*/
      return index.toString(36);
    }

    /**
     * @param {?*} children Children tree container.
     * children容器
     * @param {!string} nameSoFar Name of the key path so far.
     * 到目前为止的key的name
     * @param {!function} callback Callback to invoke with each child found.
     * 通过调用回调函数查找每个child
     * @param {?*} traverseContext Used to pass information throughout the traversal
     * process.
     * traverse：遍历，context：上下文
     * 被用来自始至终的向遍历进程传递信息
     * @return {!number} The number of children in this subtree.
     * children在当前子树中的数量
     */
    /** 遍历所有子节点的实现 */
    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
      var type = typeof children;

      if (type === 'undefined' || type === 'boolean') {
        // All of the above are perceived as null.
        /** 以上所有情况将被视为null */
        children = null;
      }

      // undefined boolean string number function object，剩下的就是object、function
      if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
        /** 回调函数中传入的是遍历上下文，children，*/
        callback(traverseContext, children,
                 // If it's the only child, treat the name as if it was wrapped in an array
                 /** 如果它只是一个子节点，把name看成类似于包裹在一个数组中 */
                 // so that it's consistent if the number of children grows.
                 /** 以至于children增长的数量是一致的 */
                 nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
        return 1;
      }

      var child;
      var nextName;
      var subtreeCount = 0; // children的数量在当前的子树中
      /** 这里可能要好好分析分析了，key到底是整个页面只能用一个，还是同一层级关系只能用一个 */
      // 下一个名字的前缀
      // 如果nameSoFar是空字符串，则返回分隔符(.)
      // 如果不是空字符串的话，则返回nameSoFar + 子树的分隔符(:)
      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

      /** 判断如果children是数组的话 */
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          nextName = nextNamePrefix + getComponentKey(child, i); /** 果然这里会给key加前缀 */
          /** 子树的数量 */
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        /** 获得children的迭代函数 */
        var iteratorFn = getIteratorFn(children);
        if (iteratorFn) {
          // 获取迭代器
          var iterator = iteratorFn.call(children);
          // 步数
          var step;
          if (iteratorFn !== children.entries) {
            var ii = 0;
            while (!(step = iterator.next()).done) {
              child = step.value;
              nextName = nextNamePrefix + getComponentKey(child, ii++);
              subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
            }
          } else {
            if (isDev) {
              // addendum: 附件，附录
              var mapsAsChildrenAddendum = '';
              if (ReactCurrentOwner.current) {
                var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
                if (mapsAsChildrenOwnerName) {
                  mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
                }
              }
              isDev ?
                warning(didWarnAboutMaps,
                        'Using Maps as children is not yet fully supported. ' +
                        'It is an experimental feature that might be removed. ' +
                        'Convert it to a sequence / iterable of keyed ReactElements instead.%s',
                        mapsAsChildrenAddendum) : void 0;
              didWarnAboutMaps = true;
            }
            /** 迭代器将会提供整个元组而不是值 */
            // Iterator will provide entry [k,v] tuples rather than values.
            /**  */
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                child = entry[1];
                nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
                subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
              }
            }
          }
        } else if (type === 'object') {
          var addendum = '';
          if (isDev) {
            addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
            if (children._isReactElement) {
              addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
            }
            if (ReactCurrentOwner.current) {
              var name = ReactCurrentOwner.current.getName();
              if (name) {
                addendum += ' Check the render method of `' + name + '`.';
              }
            }
          }
          var childrenString = String(children);
          !false ? isDev ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
        }
      }

      return subtreeCount;
    }

    /**
     * Traverses children that are typically specified as `props.children`, but
     * might also be specified through attributes:
     *
     * - `traverseAllChildren(this.props.children, ...)`
     * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
     *
     * The `traverseContext` is an optional argument that is passed through the
     * entire traversal. It can be used to store accumulations or anything else that
     * the callback might find relevant.
     *
     * @param {?*} children Children tree object.
     * @param {!function} callback To invoke upon traversing each child.
     * @param {?*} traverseContext Context for traversal.
     * @return {!number} The number of children in this subtree.
     */
    function traverseAllChildren(children, callback, traverseContext) {
      if (children == null) {
        return 0;
      }

      return traverseAllChildrenImpl(children, '', callback, traverseContext);
    }

    module.exports = traverseAllChildren;
  },{"133":133,"142":142,"164":164,"174":174,"23":23,"37":37,"63":63}]
}
