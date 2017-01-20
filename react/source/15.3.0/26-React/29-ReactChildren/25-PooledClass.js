{
  25:[function(_dereq_,module,exports){
    /**
     * @providesModule PooledClass
     */

    'use strict';
    var _prodInvariant = _dereq_(142);
    var invariant = _dereq_(164);

    /**
     * 静态的池子，几个自定义版本对于每个潜在的数量的参数
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
      var Klass = this; // 用临时变量保存下this
      if (Klass.instancePool.length) { // Klass
        var instance = Klass.instancePool.pop(); //
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

    // 标准的释放
    var isDev = "development" !== 'production';

    /**
     * 标准的释放
     * 首先判断是否是Klass的实例，之后释放掉
     */
    var standardReleaser = function (instance) {
      var Klass = this;
      // 如果实例是Klass的实例，则执行void 0
      // 如果实例不是Klass的实例，则：
      // 如果是dev环境，调用invariant
      // 如果是prod环境，调用_prodInvariant
      !(instance instanceof Klass) ? (isDev ?
                                      // 正在尝试释放一个不同类型的池子
        invariant(
          false, 'Trying to release an instance into a pool of a different type.'
        ) : _
      prodInvariant('25')) : void 0;
      instance.destructor(); // 调用析构函数
      if (Klass.instancePool.length < Klass.poolSize) {
        Klass.instancePool.push(instance);
      }
    };

    // 默认的POOL的大小是10
    var DEFAULT_POOL_SIZE = 10;
    // 默认的池子是oneArgumentPooler
    var DEFAULT_POOLER = oneArgumentPooler;

    /**
     * 参数CopyConstructor是一个可以作为池子的类
     * 只是静态地增加类它自己，并不增加任何典型的属性
     * 任何你给定的CopyConstructor也许都有一个poolSize属性
     * 并且将寻找一个典型的`destructor`在实例中
     * Augments `CopyConstructor` to be a poolable class, augmenting only the class
     * itself (statically) not adding any prototypical fields. Any CopyConstructor
     * you give this may have a `poolSize` property, and will look for a
     * prototypical `destructor` on instances.
     * 可以被用来重置的构造函数
     * @param {Function} CopyConstructor Constructor that can be used to reset.
     * 可定制的池
     * @param {Function} pooler Customizable pooler.
     */
    var addPoolingTo = function (CopyConstructor, pooler) {
      // 新的Klass，就是传入的构造函数
      var NewKlass = CopyConstructor;
      // 新的Klass有一个盛放实例的池子
      NewKlass.instancePool = [];
      // 新的Klass的getPooled的默认值就是上面定义的
      NewKlass.getPooled = pooler || DEFAULT_POOLER;
      // 判断是否指定了池子大小：默认的池子大小是10
      if (!NewKlass.poolSize) {
        NewKlass.poolSize = DEFAULT_POOL_SIZE;
      }
      // 释放函数，就是上面定义的标准的释放函数
      NewKlass.release = standardReleaser;
      // 返回一个新的NewKlass
      return NewKlass;
    };

    // 导出PooledClass
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
