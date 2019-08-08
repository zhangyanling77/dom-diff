/**
 * Element 虚拟DOM元素基类
 */
class Element {
  constructor(type, props, children){
    this.type = type
    this.props = props
    this.children = children
  }
}

/**
 * createElement 返回虚拟节点 object
 * @param {*} type 
 * @param {*} props 
 * @param {*} children 
 */
function createElement(type, props, children) {
  return new Element(type, props, children)
}

/**
 * setAttr 设置属性 需要判断一些特殊的元素或属性，如input、textrea、style等
 * @param {*} node 
 * @param {*} key 
 * @param {*} value 
 */
function setAttr(node, key, value) {
  switch(key) {
    case 'value': // node是一个input或者textarea
      if(node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break;
    case 'style':
      node.style.cssText = value
      break;
    default:
      node.setAttribute(key, value)
      break;
  }
}

/**
 * render 渲染函数
 * @param {*} eleObj 
 */
function render(eleObj) {
  let el = document.createElement(eleObj.type)
  for(let key in eleObj.props) {
    // 设置属性的方法
    setAttr(el, key, eleObj.props[key])
  }
  eleObj.children.forEach(child => {
    // 判断元素的类型
    child = (child instanceof Element) ? render(child) : document.createTextNode(child)
    el.appendChild(child)
  })
  
  return el
}

/**
 * renderDOM 渲染DOM
 * @param {*} el 
 * @param {*} target 
 */
function renderDOM(el, target) {
  target.appendChild(el)
}


export {
  Element,
  createElement,
  render,
  renderDOM,
  setAttr
}
