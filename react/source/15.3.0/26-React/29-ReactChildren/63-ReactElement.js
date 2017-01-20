{
  63:[function(_dereq_,module,exports){
    /**
     * @providesModule ReactElement
     */

    'use strict';

    var _assign = _dereq_(175);
    var ReactCurrentOwner = _dereq_(37);
    var warning = _dereq_(174);
    var canDefineProperty = _dereq_(120);
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var isDev = "development" !== 'production';

    /**
     * Symbol被用来标识React元素类型
     */
    // The Symbol used to tag the ReactElement type.
    /** 如果没有原生的Symbol类型，或者没有垫片，只能用纯数字来标识了 */
    // If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    // react_element_type
    var REACT_ELEMENT_TYPE =
          typeof Symbol === 'function' && Symbol['for'] &&
          Symbol['for']('react.element') || 0xeac7; // 60103

    // reserved_props：保留的属性
    var RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true
    };

    /** 特殊属性key警告显示、特殊属性ref警告显示 */
    var specialPropKeyWarningShown, specialPropRefWarningShown;

    /** 是否是有效的Ref */
    function hasValidRef(config) {
      if (isDev) {
        /** 如果config存在ref属性 */
        if (hasOwnProperty.call(config, 'ref')) {
          /** 得到属性的描述器 */
          var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
          /** 如果getter存在并且getter.isReactWarning属性存在，则返回false */
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      /** ref属性不为undefined，则返回true */
      return config.ref !== undefined;
    }

    /** 是否是有效的Key，同Ref属性 */
    function hasValidKey(config) {
      if (isDev) {
        if (hasOwnProperty.call(config, 'key')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.key !== undefined;
    }

    /**
     * 总结：在生产环境下，ReactElement方法只是为了返回一个对象
     * Factory method to create a new React element.
     * 该函数是一个工厂方法，用于创建一个新的React元素
     * This no longer adheres to the class pattern, so do not use new to call it.
     * 该函数中不再遵循类模式，因此不再需要使用new关键字去调用它
     * Also, no instanceof check will work.
     * 而且也没有instanceof去检查代码
     * Instead test $$typeof field against Symbol.for('react.element') to check
     * 虽然不能用instanceof关键字检查代码，可以测试$$typeof属性是否不等于Symbol.for('react.element')来进行代码检查
     * 判断是否是一个React元素
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} key
     * @param {string|object} ref
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * self属性：一个临时的助手用来检测，当React.createElement方法被调用的时候，检测this不同于owner的地方
     * 以至于我们可以发出警告信息。
     * 我们想要摆脱owner，并且通过箭头函数来替换ref字符串
     * 只要this和owner相同，将不会有什么行为上的改变
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * source属性：一个注解对象，标明文件名，行号，和其他的信息（是通过编译器或者其他方式添加了）
     * @param {*} owner
     * @param {*} props
     * @internal : 内部的方法
     */
    var ReactElement = function (type, key, ref, self, source, owner, props) {
      var element = {
        /** 这个标识允许我们唯一的去识别React元素 */
        // This tag allow us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,
        /** 元素内置的属性 */
        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,

        /** 创建元素并记录组件 */
        // Record the component responsible for creating this element.
        _owner: owner
      };

      if (isDev) {
        // The validation flag is currently mutative.
        /** 用于验证的标识一般是变化的 */
        // We put it on an external backing store so that we can freeze the whole object.
        /** 我们把它放在一个外部的存储，以至于我们可以冻结整个对象*/
        // This can be replaced with a WeakMap once they are implemented in
        /** 这可以使用WeakMap代替，一旦它们被实现在同一个开发环境中 */
        // commonly used development environments.
        element._store = {};
        /** children 的拷贝 */
        /**
         * 首先判断是否是数组，
         * 之后调用slice方法进行数组的拷贝
         * 如果不是数组的话，直接返回children
         */
        var shadowChildren =
              Array.isArray(props.children) ? props.children.slice(0) : props.children;

        // To make comparing ReactElements easier for testing purposes
        /** 为了在测试时，更加容易得对比React元素 */
        // we make the validation flag non-enumerable (where possible,
        // which should include every environment we run tests in),
        /** 我们设置被用来验证的标识不能够被枚举(如果可能的话，应该包括在我们运行的每一个测试环境) */
        // so the test framework ignores it.
        /** 因此测试框架将会忽略它 */

        /** 判断是否可以调用Object.defineProperty */
        if (canDefineProperty) {
          Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          /** self 和 source属性只是开发环境中用到的属性 */
          // self and source are DEV only properties.
          Object.defineProperty(element, '_self', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          });

          /** children的拷贝 */
          Object.defineProperty(element, '_shadowChildren', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: shadowChildren
          });
          // Two elements created in two different places should be considered
          // equal for testing purposes and therefore we hide it from enumeration.
          /** 为了测试的目的，在不同地方创建的两个元素应该做相同的考虑， 因此我们隐藏它们的枚举 */
          Object.defineProperty(element, '_source', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
        } else {
          /** 如果不能调用Object.defineProperty方法的话，就直接赋值，不设置枚举不可见属性了*/
          element._store.validated = false;
          element._self = self;
          element._shadowChildren = shadowChildren;
          element._source = source;
        }
        if (Object.freeze) {
          Object.freeze(element.props);
          Object.freeze(element);
        }
      }

      return element;
    };

    /**
     * Create and return a new ReactElement of the given type.
     * 创建并返回一个指定类型的新的React元素
     * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
     */
    ReactElement.createElement = function (type, config, children) {
      var propName;

      // Reserved names are extracted
      var props = {};

      var key = null;
      var ref = null;
      var self = null;
      var source = null;

      if (config != null) {
        if (isDev) {
          isDev ? warning(
            /** 禁止对__proto__属性进行检查 */
            /* eslint-disable no-proto */
            /** config必须是一个纯对象 */
            config.__proto__ == null || config.__proto__ === Object.prototype,
            /** 开启对__proto__属性的检查 */
            /* eslint-enable no-proto */
            /** 被期望的属性参数应该是一个纯对象，被定义在原型链上的属性将会被忽略 */
            'React.createElement(...): ' +
              ' + Expected props argument to be a plain object. ' +
              'Properties defined in its prototype chain will be ignored.') : void 0;
        }

        /** 验证ref和key */
        if (hasValidRef(config)) {
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        /**
         var RESERVED_PROPS = {
         key: true,
         ref: true,
         __self: true,
         __source: true
         };
         **/

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        // Remaining properties are added to a new props object
        // 保留的属性将被添加到新的props对象上
        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
          }
        }
      }

      // Children can be more than one argument,
      /** children可能会有超过1个的参数 */
      // and those are transferred onto the newly allocated props object.
      /** 并且它们将会被转换成新分配的props对象 */
      //
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }

      // Resolve default props
      // 解析默认props
      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      if (isDev) {
        // 显示的名字，函数的话，就显示displayName或者name或者'unKnow'，如果不是的话，就使用type
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

        // Create dummy `key` and `ref` property to `props` to warn users against its use
        // 创建虚拟key和ref属性到props中，警告用户避免它的使用
        var warnAboutAccessingKey = function () {
          if (!specialPropKeyWarningShown) {
            specialPropKeyWarningShown = true;
            // key不是一个属性，尝试访问它将会得到undefined
            // 如果你需要在子组件中访问相同的值，你应该通过一个不同的属性来访问
            isDev ? warning(false,
                            '%s: `key` is not a prop. ' +
                            'Trying to access it will result ' +
                            'in `undefined` being returned. ' +
                            'If you need to access the same ' +
                            'value within the child component, ' +
                            'you should pass it as a different ' +
                            'prop. (https://fb.me/react-special-props)',
                            displayName) : void 0;
          }
          return undefined;
        };
        warnAboutAccessingKey.isReactWarning = true;

        var warnAboutAccessingRef = function () {
          if (!specialPropRefWarningShown) {
            specialPropRefWarningShown = true;
            isDev ? warning(false,
                            '%s: `ref` is not a prop.' +
                            'Trying to access it will result ' +
                            'in `undefined` being returned. ' +
                            'If you need to access the same ' +
                            'value within the child component, you should pass it as a different ' +
                            'prop. (https://fb.me/react-special-props)', displayName) : void 0;
          }
          return undefined;
        };
        warnAboutAccessingRef.isReactWarning = true;

        if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
          if (!props.hasOwnProperty('key')) {
            Object.defineProperty(props, 'key', {
              get: warnAboutAccessingKey,
              configurable: true
            });
          }
          if (!props.hasOwnProperty('ref')) {
            Object.defineProperty(props, 'ref', {
              get: warnAboutAccessingRef,
              configurable: true
            });
          }
        }
      }
      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    };

    /**
     * Return a function that produces ReactElements of a given type.
     * 返回一个生产指定类型的React元素的函数
     * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
     */
    ReactElement.createFactory = function (type) {
      var factory = ReactElement.createElement.bind(null, type);
      // Expose the type on the factory and the prototype so that it can be
      // easily accessed on elements. E.g. `<Foo />.type === Foo`.
      // This should not be named `constructor` since this may not be the function
      // that created the element, and it may not even be a constructor.
      // Legacy hook TODO: Warn if this is accessed
      factory.type = type;
      return factory;
    };

    /** 克隆并替换新的key值 */
    ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
      var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

      return newElement;
    };

    /**
     * 克隆并且返回一个新的ReactElement，使用element作为第一个参数
     * Clone and return a new ReactElement using element as the starting point.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
     */
    ReactElement.cloneElement = function (element, config, children) {
      var propName;

      // Original props are copied
      var props = _assign({}, element.props);

      // Reserved names are extracted
      var key = element.key;
      var ref = element.ref;
      // Self is preserved since the owner is preserved.
      var self = element._self;
      // Source is preserved since cloneElement is unlikely to be targeted by a
      // transpiler, and the original source is probably a better indicator of the
      // true owner.
      var source = element._source;

      // Owner will be preserved, unless ref is overridden
      var owner = element._owner;

      if (config != null) {
        if (isDev) {
          isDev ? warning(
            /* eslint-disable no-proto */
            config.__proto__ == null || config.__proto__ === Object.prototype,
            /* eslint-enable no-proto */
            'React.cloneElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
        }

        if (hasValidRef(config)) {
          // Silently steal the ref from the parent.
          ref = config.ref;
          owner = ReactCurrentOwner.current;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        // Remaining properties override existing props
        var defaultProps;
        if (element.type && element.type.defaultProps) {
          defaultProps = element.type.defaultProps;
        }
        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (config[propName] === undefined && defaultProps !== undefined) {
              // Resolve default props
              props[propName] = defaultProps[propName];
            } else {
              props[propName] = config[propName];
            }
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }

      return ReactElement(element.type, key, ref, self, source, owner, props);
    };

    /**
     * 验证一个对象是否是ReactElement
     * Verifies the object is a ReactElement.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
     * @param {?object} object
     * 返回为true，表示是一个有效的组件
     * @return {boolean} True if `object` is a valid component.
     * @final
     */
    ReactElement.isValidElement = function (object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    };

    ReactElement.REACT_ELEMENT_TYPE = REACT_ELEMENT_TYPE;

    module.exports = ReactElement;
  },{"120":120,"174":174,"175":175,"37":37}]
}
