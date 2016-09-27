{
  88:[function(_dereq_,module,exports){
    /**
     * @providesModule ReactPureComponent
     */

    'use strict';
    var _assign = _dereq_(175);
    var ReactComponent = _dereq_(32);
    var ReactNoopUpdateQueue = _dereq_(82);
    var emptyObject = _dereq_(157);

    /**
     * Base class helpers for the updating state of a component.
     * 用于更新组件状态的基础类助手
     */
    /** 纯净的React对象  */
    function ReactPureComponent(props, context, updater) {
      // Duplicated from ReactComponent.
      /** 从ReactComponent中复制 */
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      /**  */
      this.updater = updater || ReactNoopUpdateQueue;
    }

    /** 自定义组件 */
    function ComponentDummy() {}
    ComponentDummy.prototype = ReactComponent.prototype;
    ReactPureComponent.prototype = new ComponentDummy();
    ReactPureComponent.prototype.constructor = ReactPureComponent;
    // Avoid an extra prototype jump for these methods.
    _assign(ReactPureComponent.prototype, ReactComponent.prototype);
    ReactPureComponent.prototype.isPureReactComponent = true;

    module.exports = ReactPureComponent;
  },{"157":157,"175":175,"32":32,"82":82}]
}
