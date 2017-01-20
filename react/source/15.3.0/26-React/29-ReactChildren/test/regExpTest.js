var regExp = /([obj, obj]),/;
var str = '[obj, obj],';

/*
不记录匹配
p(regExp, str, regExp.test(str)); // true

regExp = /(\[obj, obj\]),/;
p(regExp, str, regExp.test(str)); // true

regExp = /(\[obj, obj\]),\1/;
str = '[obj, obj],[obj, obj]';
p(regExp, str, regExp.test(str)); // true

regExp = /(?:\[obj, obj\]),\1/;
str = '[obj, obj],[obj,obj]';
p(regExp, str, regExp.test(str)); // false

regExp = /(?:\[obj, obj\])(,)\1/;
str = '[obj, obj],,';
p(regExp, str, regExp.test(str)); // true
*/

regExp = /a.*?b/;
str = 'abxyb';

// p(regExp, str, regExp.test(str));

// str.replace(regexp/substr,replacement)

// $1,$2,$3...$99：与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。
// $&：与 regexp 相匹配的子串。
// $`: 位于匹配子串左侧的文本。
// $': 位于匹配子串右侧的文本。
// $$	直接量符号：所谓之间量符号，就是正则中写的那些字符，匹配的也是那些字符

str.replace(regExp, function ($0) {
  console.log($0); // 与regexp相匹配的子串 // ab
});

regExp = /a.*b/;
str.replace(regExp, function ($0) {
  console.log($0); // 与regexp相匹配的子串 // abxyb
});

function p(regExp, str, needPrint) {
  console.log('regExp--->' + regExp);
  console.log('testStr--->' + str);
  console.log('results--->' + needPrint);
}

