{63:[function(_dereq_,module,exports){

  /**
   * @providesModule ReactElement
   */

  'use strict';

  var _assign = _dereq_(175);

  var ReactCurrentOwner = _dereq_(37);

  var warning = _dereq_(174);
  var canDefineProperty = _dereq_(120);
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  // Symbol被用来连接ReactElement类型，如果不支持原生的Symbol或者没有垫片，那么就用一个纯数字来执行
  // The Symbol used to tag the ReactElement type. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var REACT_ELEMENT_TYPE =
        typeof Symbol === 'function' && Symbol['for'] &&
        Symbol['for']('react.element') || 0xeac7; // 0xeac7


  // reserved_props：保留的属性
  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };

  var specialPropKeyWarningShown, specialPropRefWarningShown;

  function hasValidRef(config) {
    if ("development" !== 'production') {
      if (hasOwnProperty.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    if ("development" !== 'production') {
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
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, no instanceof check
   * will work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   * 工厂方法去创建一个新的React元素.不再坚持类模式，因此不需要使用new去调用它.
   * 而且，没有instanceof去检查工作。
   * 如果元素是一个React元素，取而代之的是测试$$typeof属性是否不等于Symbol.for('react.element');
   *
   * @param {*} type
   * @param {*} key
   * @param {string|object} ref
   * 一个临时的帮助器去检测places，this是不同于owner当React.createElement被调用，以至于我们可以警告
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   我们想拜托owner并且代替字符串ref使用箭头函数，并且只要this和owner是相同的，行为将不会修改
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   *一个注释对象（通过编译器被增加）
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information. // 表明文件名，行号，和其他信息
   * @param {*} owner
   * @param {*} props
   * @internal: 内部的
   */

  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // 这个标签允许我们唯一的去识别React元素
      // This tag allow us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
      // 根据属性构建属性
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // 记录罪案负责创建该元素
      // Record the component responsible for creating this element.
      _owner: owner
    };

    // 如果是开发模式下
    if ("development" !== 'production') {
      // 这个验证标识是当前变化的。
      // 我们把它放在一个外部可支持的存储，以至于我们冻结整个对象。
      // 这可以被代替通过一个WeakMap，一旦他们被实现在共同的开发环境中
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {};
      // 子节点阴影：判断props.children是否是数组，
      // 如果不是的话，他们认为children可能是一个类数组，不管怎么样，都是直接返回
      // props.children.slice(0); //返回的是数组的拷贝，并不是指向
      var shadowChildren = Array.isArray(props.children) ? props.children.slice(0) : props.children;

      // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.

      // 为了更加容易得比较React元素处于测试目的，我们让验证标识不可以被枚举（可能的话，应该包括我们运行测试的每个环境）
      // 因此测试框架将会忽略它

      if (canDefineProperty) { // 如果可以定义属性的话
        Object.defineProperty(element._store, 'validated', { // 定义validated属性
          configurable: false,
          enumerable: false,
          writable: true,
          value: false
        });
        // 只有在开发环境下才有的属性
        // self and source are DEV only properties.
        Object.defineProperty(element, '_self', { // '_self'
          configurable: false,
          enumerable: false,
          writable: false,
          value: self
        });
        Object.defineProperty(element, '_shadowChildren', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: shadowChildren
        });
        // 两个元素在两个不同的地方被创建，应该考虑在测试的时候相等，因此我们在枚举配置中隐藏它
        // Two elements created in two different places should be considered
        // equal for testing purposes and therefore we hide it from enumeration.
        Object.defineProperty(element, '_source', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: source
        });
      } else { // 如果不能调用defineProperty方法的话，就这样赋值
        element._store.validated = false;
        element._self = self;
        element._shadowChildren = shadowChildren;
        element._source = source;
      }
      // 然后冻结它们
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element; // 并且返回最后的元素
  };

  /**
   * 根据给定的type，创建并返回一个新的ReactElement
   * Create and return a new ReactElement of the given type.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
   */
  ReactElement.createElement = function (type, config, children) {
    var propName;// 属性名

    // 保留提取到的名字
    // Reserved（保留） names are extracted（提取出的）
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) { // 如果没有config这个参数
      if ("development" !== 'production') { // 如果是在开发环境下
        "development" !== 'production' ? warning(
//          http://eslint.org/docs/rules/no-proto.html
// 这里由于__proto__属性已经在ecmascript 3.1中过时了，不应该被使用，应该通过getPrototypeOf进行替换
          /* eslint-disable no-proto */
          config.__proto__ == null || config.__proto__ === Object.prototype,
          /* eslint-enable no-proto */
          'React.createElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
      }

      if (hasValidRef(config)) {
        // config中是否存在该ref属性，或者ref属性的访问器属性getter方法是否是React所警告的
        ref = config.ref;
      }

      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self; // 判断是否有__self属性
      source = config.__source === undefined ? null : config.__source;
      // 保留属性被添加到一个新的props对象上
      // Remaining properties are added to a new props object
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) { // 也就是说要排除key和ref、__self、__source属性
          props[propName] = config[propName];
        }
      }
    }
    // children可以是多于1个的参数，并且那会被转换成新分配的props对象
    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.

    var childrenLength = arguments.length - 2; // 剩下参数的长度，就是传入子节点的长度

    if (childrenLength === 1) { //当长度为1时，就是当前下的children
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength); // 如果大于1的话，创建一个对应长度的空数组
      for (var i = 0; i < childrenLength; i++) { // 将参数的内容加入数组中，然后，赋值给children
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) { // 解析默认属性
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }

    if ("development" !== 'production') {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
      //
      // Create dummy `key` and `ref` property to `props` to warn users against its use
      var warnAboutAccessingKey = function () {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;
          "development" !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
        }
        return undefined;
      };
      warnAboutAccessingKey.isReactWarning = true;

      var warnAboutAccessingRef = function () {
        if (!specialPropRefWarningShown) {
          specialPropRefWarningShown = true;
          "development" !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
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
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
   */
  // 创建一个工厂方法
  ReactElement.createFactory = function (type) {
    // 通过bind方法，提前给createElement方法传递参数
    var factory = ReactElement.createElement.bind(null, type);
    // 在工厂方法中暴露类型和prototype，以至于它可以更容易被elements访问到。
    // 例如<Foo />.type === 'Foo';
    // Expose the type on the factory and the prototype so that it can be
    // easily accessed on elements. E.g. `<Foo />.type === Foo`.
    // This should not be named `constructor` since this may not be the function
    // that created the element, and it may not even be a constructor.
    // Legacy hook TODO: Warn if this is accessed
    factory.type = type;
    return factory;
  };

  // 克隆并且替换Key
  ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

    return newElement;
  };

  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
   * 克隆和返回一个新的React元素，使用元素作为开始点
   */
  ReactElement.cloneElement = function (element, config, children) {
    var propName;
    // 拷贝原来的props
    // Original props are copied
    var props = _assign({}, element.props);

    // Reserved names are extracted
    // 保留被提取的名字
    var key = element.key;
    var ref = element.ref;
    // Self is preserved since the owner is preserved.
    // 保存self
    var self = element._self;
    // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source = element._source;

    // Owner will be preserved, unless ref is overridden
    var owner = element._owner;

    if (config != null) {
      if ("development" !== 'production') {
        "development" !== 'production' ? warning(
          /* eslint-disable no-proto */
          config.__proto__ == null || config.__proto__ === Object.prototype,
          /* eslint-enable no-proto */
          'React.cloneElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
      }

      // 这个地方将key和ref从config中取出来了，而不是用原来的
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current; // owner
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
   * Verifies the object is a ReactElement.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a valid component.
   * @final
   */
  // 是否是有效的元素，
  ReactElement.isValidElement = function (object) {
    // 首先必须是对象，不能是null，类型要能是react元素类型
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  ReactElement.REACT_ELEMENT_TYPE = REACT_ELEMENT_TYPE;

  module.exports = ReactElement;
},{"120":120,"174":174,"175":175,"37":37}]}
