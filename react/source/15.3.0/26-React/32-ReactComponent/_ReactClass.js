/**
 * validateTypeDef(Constructor, childContextTypes, ReactPropTypeLocations.childContext);
 */
var isDev = "development" !== 'production';
// noop: 等待
/** 该方法的作用只是用来验证typeDef的，如果条件不满足，则抛出warning */
function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      // use a warning instead of an invariant so components
      // don't show up in prod but only in __DEV__
      // 使用warning方法代替invariant，因此组件不用在生产环境下调用prod方法了，只是在DEV环境中

      isDev ?
        /**
         * condition: typeof typeDef[propName] === 'function'
         */
        warning(
          typeof typeDef[propName] === 'function',
          '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.',
          Constructor.displayName || 'ReactClass',
          ReactPropTypeLocationNames[location],
          propName
        ) : void 0;
    }
  }
}

/** 验证方法覆写 */
function validateMethodOverride(isAlreadyDefined, name) {
  var specPolicy =
        ReactClassInterface.hasOwnProperty(name) ?
        ReactClassInterface[name] : null;

  // Disallow overriding of base class methods unless explicitly allowed.
  /** 禁止覆盖基本的类方法，除非有明确的允许  */
  // 这次是直接抛出error了
  if (ReactClassMixin.hasOwnProperty(name)) {
    !(specPolicy === SpecPolicy.OVERRIDE_BASE) ?
      isDev ?
      invariant(
        false,
        'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.',
        name
      ) : _prodInvariant('73', name)
    : void 0;
  }

  // Disallow defining methods more than once unless explicitly allowed.
  /** 禁止定义超过1个的方法，除非有明确的允许 */
  if (isAlreadyDefined) {
    !(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED) ?
      isDev ? invariant(
        false,
        'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.',
        name
      ) : _prodInvariant('74', name)
    : void 0;
  }
}
