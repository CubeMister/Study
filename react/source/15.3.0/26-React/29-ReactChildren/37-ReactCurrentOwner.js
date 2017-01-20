37:[function(_dereq_,module,exports){
  /**
   * @providesModule ReactCurrentOwner
   */

  'use strict';

  /**
   * 保持对当前所有者的跟踪
   * Keeps track of the current owner.
   * 当前所有者是一个应该拥有当前正在被构建的任何组件的组件
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */

  var ReactCurrentOwner = {

    /**
     * @internal // 内部方法
     * @type {ReactComponent} // 类型是ReactComponent
     */
    current: null
  };

  module.exports = ReactCurrentOwner;
},{}]
