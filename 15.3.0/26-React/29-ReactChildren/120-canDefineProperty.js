{
  120:[function(_dereq_,module,exports){
    /**
     * @providesModule canDefineProperty
     */

    // react使用的构建工具是browserify
    // 代码中多次出现的"development" !== 'production'其实是通过browserify构建工具的插件构建出来的
    // 可以在npmjs.org中搜索invariant，在该模块的说明中会指出来的
    // 那插件的名字就是envify
    // github地址：https://github.com/hughsk/envify

    'use strict';

    // 该方法的作用是判断当前环境下能否使用Object.defineProperty属性
    var canDefineProperty = false;
    var isDev = "development" !== 'production';
    if ("development" !== 'production') {
      try {
        // 如果这里出错的话，下面设置true的语句便不会执行，然后会进入catch中进行捕获
        // obj, attr, config
        // 给一个空对象定义一个x属性，并且定义一个get方法

        Object.defineProperty({}, 'x', { get: function () {} });
        canDefineProperty = true;
      } catch (x) {
        // 在IE下将会定义失败
        // IE will fail on defineProperty
      }
    }

    module.exports = canDefineProperty;
  },{}]
}
