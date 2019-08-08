import { 
  Element, 
  render,
  setAttr
} from "./element";

/**
 * patch
 * @param {*} node 
 * @param {*} patches 
 */

 let allPatches, index = 0; // 默认哪个需要打补丁

function patch(node, patches) {
  // 给某个元素打补丁
  allPatches = patches

  Walk(node)
}

/**
 * Walk
 * @param {*} node 
 */
function Walk(node) {
  let currentPatch = allPatches[index++]
  let childNodes = node.childNodes
  childNodes.forEach(child => Walk(child))

  if(currentPatch) {
    doPatch(node, currentPatch)
  }
}

/**
 * doPatch 具体去给元素打上补丁
 * @param {*} node 
 * @param {*} patches 
 */
function doPatch(node, patches) {
  patches.forEach(patch => {
    switch(patch.type) {
      case 'ATTRS':
          for(let key in patch.attrs) {
            let value = patch.attrs[key]
            if(value) {
              setAttr(node, key, value)
            } else {
              node.removeAttribute(key)
            }
          }
        break;
      case 'TEXT':
        node.textContent = patch.text
        break;
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break;
      case 'REPLACE':
        let newNode = (patch.newNode instanceof Element) ? render(patch.newNode) : document.createTextNode(patch.newNode)
        node.parentNode.replaceChild(newNode, node)
        break;
      default:
        break;
    }
  })
}

export default patch
