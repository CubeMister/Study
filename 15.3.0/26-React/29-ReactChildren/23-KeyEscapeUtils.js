{
  23:[function(_dereq_,module,exports){
    /**
     * key转义工具
     * @providesModule KeyEscapeUtils
     */

    'use strict';

    /**
     * 转义并且封装key，因此它作为reactid来使用时安全的
     * Escape and wrap key so it is safe to use as a reactid
     * 需要转义的key
     * @param {string} key to be escaped.
     * 返回转义的key
     * @return {string} the escaped key.
     */

    function escape(key) {
      // 转义正则
      // []表示匹配里面的任一字符
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      var escapeRegex = /[=:]/g;
      // 转义查询
      var escaperLookup = {
        '=': '=0',
        ':': '=2'
      };
      // 转义后的字符串
      // 这里匹配上的内容有 = 和 :
      var escapedString = ('' + key).replace(escapeRegex, function (match) {
        return escaperLookup[match];
      });

      // 最后加一个$返回
      return '$' + escapedString;
    }

    /**
     * 没有转义以及没有包装过的key，可以用来查看
     * 该方法其实就是对上面方法生成的字符串进行了逆操作
     * Unescape and unwrap key for human-readable display
     * @param {string} key to unescape.
     * @return {string} the unescaped key.
     */
    function unescape(key) {
      var unescapeRegex = /(=0|=2)/g;
      var unescaperLookup = {
        '=0': '=',
        '=2': ':'
      };

      // 如果key第一个字符是.并且是$的话，那就从第三个字符开始截取，截取到最后，
      // 否则就从第二个字符开始截取到最后
      var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) :
            key.substring(1);

      // 返回解析后的key
      return ('' + keySubstring).replace(unescapeRegex, function (match) {
        return unescaperLookup[match];
      });
    }

    var KeyEscapeUtils = {
      escape: escape,
      unescape: unescape
    };

    module.exports = KeyEscapeUtils;
  },{}]
}
