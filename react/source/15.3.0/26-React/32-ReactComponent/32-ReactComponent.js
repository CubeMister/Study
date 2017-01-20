{
  32:[function(_dereq_,module,exports){
    /**
     * @providesModule ReactComponent
     */

    'use strict';

    var _prodInvariant = _dereq_(142);
    var ReactNoopUpdateQueue = _dereq_(82);
    var canDefineProperty = _dereq_(120);
    var emptyObject = _dereq_(157);
    var invariant = _dereq_(164);
    var warning = _dereq_(174);
    var isDev = "development" !== 'production';

    /**
     * 这是一个基础类，用来帮助组件更新state
     * Base class helpers for the updating state of a component.
     */

    // 定义ReactComponent
    function ReactComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject; //
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      // 我们初始化默认的更新器，但是实际的那个会被注入到渲染器中
      this.updater = updater || ReactNoopUpdateQueue;
    }

    // 在原型链上挂载了一个方法isReactComponent
    ReactComponent.prototype.isReactComponent = {};

    /**
     设置一个state的子集，一直使用它去更新状态，你应该把this.state看成是不可变的
     * Sets a subset of the state. Always use this to mutate
     * state. You should treat `this.state` as immutable.
     * 不能保证this.state会立即更新，因此在调用setState方法之后，访问this.state可能会得到旧的值
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     * 这里也不能保证，调用了setState将会同步的执行.
     * 所以它们最终可能会一起批量的更新。
     * 你可以提供一个可选的回调函数,当setState被真正的执行完成时，回调函数将会被调用。
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     * 当setState的参数提供的是一个函数类型时，它会在将来的某一时刻被调用（不是同步的被调用）
     * 它将会被调用随着最新的组件参数(state, props, context).
     * 这些值不同于this.*（this下面的属性）
     * 因为你的函数也许会被调用在receiveProps之后，但是是在shouldComponentUpdate之前，
     * 并且新的state、props和context将不被分配到this上。
     * 总而言之，你传递给setState一个函数，这个函数一定会在state, props, context得到最新值之后调用，
     * 并且这些最新的值不会被挂载到this上，因为state，props，context得到最新值之后，将会立即调用传入setState
     * 的那个函数来继续更新状态。
     * When a function is provided to setState, it will be called at some point in
     * the future (not synchronously). It will be called with the up to date
     * component arguments (state, props, context). These values can be different
     * from this.* because your function may be called after receiveProps but before
     * shouldComponentUpdate, and this new state, props, and context will not yet be
     * assigned to this.
     *
     * @param {object|function} partialState Next partial state or function to
     *        produce next partial state to be merged with current state.
     下一个局部的state或者函数去生成下一个局部的state，并且下一个局部的state将会和当前的state做merged操作
     * @param {?function} callback Called after state is updated. state被更新之后将会被调用
     * @final: 不可覆盖，重写
     * @protected：受保护的
     */

    // setState: 真正的重头戏
    // partialState: 局部状态
    // callback：回调函数
    ReactComponent.prototype.setState = function (partialState, callback) {
      // 首先判断局部状态的类型是否是object或是function或是值等于null
      // 简化代码：
      var typeArr = ['object', 'function']; // 传入的state必须是object或者function
      var pS = partialState;
      var typeStr = typeof pS; // 得到传入state的类型
      var junkVar = !(typeArr.indexOf(typeStr) !== -1 || pS == null); // 如果null或者对象、函数，
      var isDev = ("development" !== 'production');
      // 如果不满足上述条件的话，就会判断是否是开发环境，如果是的话，就调用invariant，或者prodInvariant，如果条件满足的话，直接返回undefined
      var junkVar2 = junkVar? (isDev? invariant(false, `
setState(...): takes an object of state variables to update
or a function which returns an object of state variables.
setState(...): 把一个对象的state变量更新
或者执行一个能够返回state对象的函数
`): _prodInvariant('85')): void 0; // void 0 : undefined


      // 也就是说，这两个方法是专门用来抛出错误的

      /*
       var junkVar3 = !(
       typeof partialState === 'object'
       || typeof partialState === 'function'
       || partialState == null) ?
       "development" !== 'production' ?
       invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') :
       _prodInvariant('85') : void 0;
       */
      // enqueue：排队设置state， 或者说进入队列
      this.updater.enqueueSetState(this, partialState);
      if (callback) {
        // 排队调用callback，进入队列
        this.updater.enqueueCallback(this, callback, 'setState');
      }
    };

    /**
     * 强制更新。这应该只是被调用，当它确定是已知的, 我们不在一个DOM的失误中
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     * 你也许想要调用这个当你知道一些更深的在组件状态方面已经被改变，但是setState没有被调用
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     * 这将不会调用shouldComponentUpdate，但是它将会调用componentWillUpdate和componentDidUpdate
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete. //调用之后，更新就会完成
     * @final
     * @protected
     */

    // 强制更新
    ReactComponent.prototype.forceUpdate = function (callback) {
      // 进入队列强制更新
      this.updater.enqueueForceUpdate(this);
      if (callback) {

        this.updater.enqueueCallback(this, callback, 'forceUpdate');
      }
    };

    /**
     * 过期的APIs. 这些api过去经常存在典型的React类中，但是自从我们想要过期他们，我们不会把他们移动到当前的基类中的
     * Deprecated APIs. These APIs used to exist on classic React classes but since
     * we would like to deprecate them, we're not going to move them over to this
     * modern base class. Instead, we define a getter that warns if it's accessed.
     * 取而代之的是，我们定义了一种更好的方式，如果它们被访问，则会发出警告

     isMounted：
     Instead,
     make sure to clean up subscriptions and pending requests in
     componentWillUnmount to prevent memory leaks.
     相反，一定要清理订阅和挂起的请求在componentWillUnmount，防止内存溢出

     replaceState:
     Refactor your code to use setState instead: 重构你的代码，使用setState代替
     (see ' + 'https://github.com/facebook/react/issues/3236).'
     */

    if ("development" !== 'production') { // 如果在生产环境下
      var deprecatedAPIs = { // isMounted和replaceState属于已过期的api
        isMounted: [
          'isMounted',
          'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'
        ],
        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
      };
      // 定义过期警告，方法名和信息

      /*
       "development" !== 'production' ?
       warning(
       false,
       '%s(...) is deprecated in plain JavaScript React classes. %s',
       info[0],
       info[1]
       ) : void 0;
       */

      var defineDeprecationWarning = function (methodName, info) {
        if (canDefineProperty) { //可以定义属性
          // 定义属性，在ReactComponent的原型上定义
          Object.defineProperty(ReactComponent.prototype, methodName, {
            get: function () {
              var junkVar09 = "development" !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
              return undefined;
            }
          });
        }
      };

      for (var fnName in deprecatedAPIs) {
        if (deprecatedAPIs.hasOwnProperty(fnName)) {
          defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        }
      }
    }

    module.exports = ReactComponent;
  },{"120":120,"142":142,"157":157,"164":164,"174":174,"82":82}]
}
