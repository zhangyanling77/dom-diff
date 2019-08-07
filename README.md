# dom-diff
手动实现一个dom-diff

虚拟DOM
即虚拟节点，通过JS的Object对象模拟真实的节点，然后通过特定的render方法将其渲染为真实的节点。

## 生成项目

```
npx create-react-app dom-diff
cd dom-diff && npm start

```

## 虚拟DOM
createElement => {type, props, children}

## 目录结构

```
- dom-diff
  - public
    - index.html
    - favicon.ico
    - manifest.json
  - src
    - index.js
    - element.js
    - diff.js
    - patch.js
  - .gitignore
  - package.json
  - yarn.lock
  - README.md

```
