var standardReleaser = function (instance) {
  var Klass = this;
  // 如果实例是Klass的实例，则执行void 0
  // 如果实例不是Klass的实例，则：
  // 如果是dev环境，调用invariant
  // 如果是prod环境，调用_prodInvariant
  /**
   !(instance instanceof Klass) ? (isDev ?
   // 正在尝试释放一个不同类型的池子
   new Error(
   false, 'Trying to release an instance into a pool of a different type.'
   ) : _
   new Error('25')) : void 0;
   判断是否instance是否是它的实例
   */
  // 是的话，调用实例的析构函数
  // 这里，为什么都析构掉了，为什么还要加到池子里面呢
  instance.destructor(); // 调用析构函数
  // poolSize是Klass的池子的上限
  // 而instancePool.length则是实际池子里面存放的实例的个数
  // 从后面的代码来看，是将自身的一些参数清空，得到一个纯净的对象后，再放回内存中，
  // 这样避免了重复创建的问题
  // 减少了性能开销
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

// 默认的POOL的大小是10
var DEFAULT_POOL_SIZE = 10;
// 默认的池子是oneArgumentPooler
var DEFAULT_POOLER = oneArgumentPooler;

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

/**
 给传入的方法绑定一个instancePool实例，
 将第二个参数赋值给getPooled，
 添加poolSize属性
 release方法
 最后，再返回该方法
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
    NewKlass.poolSize = 10;
  }
  // 释放函数，就是上面定义的标准的释放函数
  NewKlass.release = standardReleaser;
  // standarReleaser会调用实例的析构函数
  // 返回一个新的NewKlass
  return NewKlass;
};

function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
// 调用析构函数的
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};

PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func;
  var context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  // ForEachBookKeeping.twoArgumentPooler(forEachFunc, forEachContext)
  // 得到一个实例
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext); // 这一步将对象析构之后，放回到内存池中了
}

/**
 * 如果池子里面还有实例
 * 直接取出一个实例，实例调用Klass，然后传递两个参数进去
 * 如果池子里面一个实例都没有的话，
 * 那就new一个新的实例，再传递两个参数
 */
twoArgumentPooler = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};


function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    children = null;
  }

 if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
    callback(traverseContext, children,
             nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0;
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);

      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      var childrenString = String(children);
    }
  }

  return subtreeCount;
}
