{
  84:[function(_dereq_,module,exports){
    /**
     * @providesModule ReactPropTypeLocationNames
     */

    'use strict';
    var ReactPropTypeLocationNames = {};
    var isDev = "development" !== 'production';

    if (isDev) {
      ReactPropTypeLocationNames = {
        prop: 'prop',
        context: 'context',
        childContext: 'child context'
      };
    }

    module.exports = ReactPropTypeLocationNames;
  },{}]
}
