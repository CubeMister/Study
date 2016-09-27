{
  82:[function(_dereq_,module,exports){
    /**
     * @providesModule ReactNoopUpdateQueue
     * React Noop Update Queue: React等待更新队列
     */

    'use strict';
    var warning = _dereq_(174); // 警告
    var isDev = "development" !== 'production';

    function warnNoop(publicInstance, callerName) { // 等待警告
      if ("development" !== 'production') {
        var constructor = publicInstance.constructor;
        var junkVar01 = "development" !== 'production' ?
              warning(false, '%s(...): \
Can only update a mounted or mounting component. ' + '\
This usually means you called %s() on an unmounted component. ' + '\
This is a no-op. Please check the code for the %s component.',
                      callerName, callerName,
                      constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
      }
    }

    // 只是可以更新一个被挂载或者正在挂载的组件，这通常意味着在一个已经被卸载的组件中，它的...方法被你调用了，
    // 这是一个不正确的操作，请在...组件中检查代码

    /**
     * This is the abstract API for an update queue.
     * 这是一个抽象API接口, 一个更新队列
     */
    var ReactNoopUpdateQueue = {

      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       检查是否这个复合组件被挂载,
       true表示已经被挂载，false表示相反
       */
      isMounted: function (publicInstance) {
        return false;
      },

      /**
       * Enqueue a callback that will be executed after all the pending updates
       * have processed.
       入队有一个回调函数，在所有的等待更新已经被处理完之后回调函数将会被执行
       * @param {ReactClass} publicInstance The instance to use as `this` context.
       * @param {?function} callback Called after state is updated.
       * @internal
       实例将作为this上下文来使用
       state更新完成后回调函数将会被执行
       */
      enqueueCallback: function (publicInstance, callback) {},

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *强制更新，这个被调用应该只是当已知此时不再一个DOM的事务中
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       * 你也许想要调用这个函数，当你知道一些深层次的组件的状态已经改变，但是setState并没有被调用
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       * 这将不会调用shouldComponentUpdate 但是它将调用componentWillUpdate和componentDidUpdate
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @internal
       * 这个实例应该被重新渲染
       * 入队强制更新: 在队列中强制更新
       */
      enqueueForceUpdate: function (publicInstance) {
        warnNoop(publicInstance, 'forceUpdate');
      },

      /**
       * Replaces all of the state.: 替换所有的状态
       * Always use this or `setState` to mutate state. : 总是使用this或者setState去改变状态
       * You should treat `this.state` as immutable. 你应该对待this.state作为不可变的
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * 不能保证this.state将会被立即更新，因此访问this.state之后，调用这个方法可能会返回一个旧的值
       * @param {ReactClass} publicInstance The instance that should rerender. 实例应该重新渲染
       * @param {object} completeState Next state.
       * @internal
       */
      enqueueReplaceState: function (publicInstance, completeState) {
        warnNoop(publicInstance, 'replaceState');
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       * 设置一个state的子集，这个只是存在因为等待状态（挂起状态）是内部的。
       * 这提供了一个合并策略，这是不可用的深层属性，
       * 暴露的挂起状态或者不使用它在合并之间
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @internal，下一个部分的state将会被合并到state上，实例将会被重新渲染
       */
      enqueueSetState: function (publicInstance, partialState) {
        warnNoop(publicInstance, 'setState');
      }
    };

    module.exports = ReactNoopUpdateQueue;
  },{"174":174}]
}
