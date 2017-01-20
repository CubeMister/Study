'use strict';

/*
var HelloMessage = React.createClass({
  displayName: 'HelloMessage',
  render: function () {
    return React.createElement(
      "div",
      null,
      "Hello ",
      this.props.name
    );
  }
});
*/

var HelloMessage = React.createClass({
  displayName: 'HelloMessage',
  render: function () {
    /** 类似于数组的遍历 */
    React.Children.forEach(this.props.children, function (v, k) {
      console.log('---Value---');
      console.log(v);
      console.log('---Key---');
      console.log(k);
    }, this);

    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
});

ReactDOM.render(
    <HelloMessage name="John">
      <h2>H2 Children</h2>
      <h2>Test Children</h2>
    </HelloMessage>,
  document.getElementById('app'));

/**
 * @description 该方法创建组件的时候与传统的原型类创建对象是不同的，它不需要使用new关键字去创建实例，
 * 它们进行了很方便的封装，通过new关键字构建支持的实例返回回来
 * @param {Object} specification 该方法将根据该对象进行组件类的创建
 * 组件必须实现一个render方法，render方法只能返回一个单一的子节点，子节点可以包含任意深度的子节点
 *
 * React.createClass(specification:object);
*/

/**
 * Component Specifications 组件规范
 *
 * 1：
 * @description React渲染一个noscript标签在我们当前的diff算法中，当返回null或者false时，
 * ReactDOM.findDOMNode(this)将会返回null
 * @return ReactElement 除了返回React元素外，还可以返回null or false，表示你不想渲染任何的内容
 * @required render
 *
 * ReactElement render()
 *
 * 2：
 * @description displayName用来调试信息，JSX将会自动的设置这个值
 * string displayName
 */


/**
 * React.Children提供了很多工具方法来处理this.props.children不透明的数据结构
 * 1：
 * React.Children.map：
 * array React.Children.map(object children, function fn [, object thisArg])
 * @param {Array|Object} children children可以是一个数组，也可以是一个keyed fragment，它们将会被遍历
 * 如果children传递的是null或者undefined，那么函数也不会返回一个数组，也会返回null或者undefined
 * @param {Function} fn fn不会传递父容器对象
 * children中的每一个元素都会调用fn函数，并且使用第三个参数传入的this对象作为fn的this指向
 * @param {Object} thisArg 第二个参数this指向问题
 */
