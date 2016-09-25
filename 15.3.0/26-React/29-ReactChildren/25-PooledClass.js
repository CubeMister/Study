{
  25:[function(_dereq_,module,exports){
    /**
     * @providesModule PooledClass
     */

    'use strict';
    var _prodInvariant = _dereq_(142);
    var invariant = _dereq_(164);

    /**
     * 几个自定义版本对于每个潜在的数量的参数
     * Static poolers. Several custom versions for each potential number of
     * arguments.
     * 一个完整通用的池子很容易实现，但是需要使用arguments对象才能实现
     * A completely generic pooler is easy to implement, but would
     * require accessing the `arguments` object.
     * 在每个函数中，this指向的是都是Class自己，而不是一个实例
     * In each of these, `this` refers to
     * the Class itself, not an instance.
     * 如果有其他的需要，可以简单的在这里添加，或者在需要的地方添加
     * If any others are needed, simply add them
     * here, or in their own files.
     */
    var oneArgumentPooler = function (copyFieldsFrom) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, copyFieldsFrom);
        return instance;
      } else {
        return new Klass(copyFieldsFrom);
      }
    };

    var twoArgumentPooler = function (a1, a2) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2);
        return instance;
      } else {
        return new Klass(a1, a2);
      }
    };

    var threeArgumentPooler = function (a1, a2, a3) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3);
        return instance;
      } else {
        return new Klass(a1, a2, a3);
      }
    };

    var fourArgumentPooler = function (a1, a2, a3, a4) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3, a4);
        return instance;
      } else {
        return new Klass(a1, a2, a3, a4);
      }
    };

    var fiveArgumentPooler = function (a1, a2, a3, a4, a5) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3, a4, a5);
        return instance;
      } else {
        return new Klass(a1, a2, a3, a4, a5);
      }
    };

    var standardReleaser = function (instance) {
      var Klass = this;
      !(instance instanceof Klass) ? "development" !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
      instance.destructor();
      if (Klass.instancePool.length < Klass.poolSize) {
        Klass.instancePool.push(instance);
      }
    };

    var DEFAULT_POOL_SIZE = 10;
    var DEFAULT_POOLER = oneArgumentPooler;

    /**
     * Augments `CopyConstructor` to be a poolable class, augmenting only the class
     * itself (statically) not adding any prototypical fields. Any CopyConstructor
     * you give this may have a `poolSize` property, and will look for a
     * prototypical `destructor` on instances.
     *
     * @param {Function} CopyConstructor Constructor that can be used to reset.
     * @param {Function} pooler Customizable pooler.
     */
    var addPoolingTo = function (CopyConstructor, pooler) {
      var NewKlass = CopyConstructor;
      NewKlass.instancePool = [];
      NewKlass.getPooled = pooler || DEFAULT_POOLER;
      if (!NewKlass.poolSize) {
        NewKlass.poolSize = DEFAULT_POOL_SIZE;
      }
      NewKlass.release = standardReleaser;
      return NewKlass;
    };

    var PooledClass = {
      addPoolingTo: addPoolingTo,
      oneArgumentPooler: oneArgumentPooler,
      twoArgumentPooler: twoArgumentPooler,
      threeArgumentPooler: threeArgumentPooler,
      fourArgumentPooler: fourArgumentPooler,
      fiveArgumentPooler: fiveArgumentPooler
    };

    module.exports = PooledClass;
  },{
    "142":142,"164":164
  }]
}
