const ATTRS = 'ATTRS'
const TEXT = 'TEXT'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
let Index = 0 // 全局的

/**
 * diff 比较两个虚拟节点的差异
 * @param {*} oldTree 
 * @param {*} newTree 
 * 
 * 当节点类型相同时，去看下一个属性是否相同，产生一个属性的补丁包
 * 如，{type:'ATTRS', attrs:{class: 'list-group'}}
 * 当新的dom节点不存在，也需记录 {type:'REMOVE', index: xxx}
 * 当节点类型不相同时，直接采用替换模式{type:'REPLACE', newNode: newNode}
 * 当文本节点变了{type: 'TEXT', text:1 }
 * 
 */
function diff(oldTree, newTree) {
  let patches = {}
  let index = 0 // 私有化
  // 递归
  Walk(oldTree, newTree, index, patches)

  return patches
}

/**
 * 
 * @param {*} oldAttrs 
 * @param {*} newAttrs 
 */
function diffAttr(oldAttrs, newAttrs) {
  let patch = {}

  for(let key in oldAttrs){
    // 同一个属性值不一样
    if(oldAttrs[key] !== newAttrs[key]){
      patch[key] = newAttrs[key] // 有可能是undefined
    }
  }
  
  for(let key in newAttrs) {
    // 老节点没有新节点的属性，新增的
    if(oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key]
    }
  }

  return patch
}

/**
 * diffChildren 比较儿子节点的差异
 * @param {*} oldChildren 
 * @param {*} newChildren 
 * @param {*} patches 
 */
function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, idx) => {
    // #TODO 传递的索引不应该传index
    // index 每次传递给walk时，index是递增的 所有的都基于同一个index 使用全局的Index
    Walk(child, newChildren[idx], ++Index, patches)
  }) 
}

/**
 * 判断是不是字符串
 * @param {*} node 
 */
function isString(node) {
  return Object.prototype.toString.call(node) === '[object String]'
}

/**
 * Walk 递归树，比较后的结果放到补丁包中
 * @param {*} oldNode 
 * @param {*} newNode 
 * @param {*} index 
 * @param {*} patches 
 */

function Walk(oldNode, newNode, index, patches) {
  // 每个元素的补丁对象数组
  let currentPatch = []
  // 如果节点删除了
  if(!newNode) {
    currentPatch.push({
      type: REMOVE,
      index
    })
  } else if(isString(oldNode) && isString(newNode)){
    if(oldNode !== newNode) {
      currentPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if(oldNode.type === newNode.type) {
    // 比较属性是否有更改
    let attrs = diffAttr(oldNode.props, newNode.props)
    if(Object.keys(attrs).length > 0) {
      currentPatch.push({
        type: ATTRS, 
        attrs
      })
    }
    // 如果有儿子节点，遍历儿子
    diffChildren(oldNode.children, newNode.children, patches)
  } else {
    // 说明节点被替换了
    currentPatch.push({
      type: REPLACE,
      newNode
    })
  }
  // 当前元素确实有补丁
  if(currentPatch.length > 0) {
    // 将元素和补丁对应起来 放到大补丁包中
    patches[index] = currentPatch
    // console.log(patches)
  }
  
}

export default diff
