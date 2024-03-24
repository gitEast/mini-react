/**
 * 创建虚拟节点
 * @param {string} type dom 类型
 * @param {object} props 属性
 * @param  {...any} children
 * @returns 虚拟节点
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'string' ? createTextNode(child) : child
      )
    }
  };
}

/**
 * 返回虚拟的文本节点
 * @param {string} text 节点内容
 */
function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
}

/**
 * 将虚拟节点挂载到容器上
 * @param {object} vnode 虚拟节点
 * @param {HTMLElement} container 容器`
 */
function render(vnode, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [vnode]
    }
  };

  root = nextWorkOfUnit;
}

/**
 * 下一次要执行的任务
 */
let nextWorkOfUnit = null;
/**
 * 本次统一提交的根节点
 */
let root = null;
/**
 * 循环执行任务
 * @param {IdleDeadline} deadline
 */
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && root) {
    commitRoot(root);
  }

  requestIdleCallback(workLoop);
}

function commitRoot(root) {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  fiber.dom && fiberParent.dom.append(fiber.dom);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1. 创建 dom
    const dom = (fiber.dom = createDom(fiber.type));
    // 2. 处理 props
    updateProps(dom, fiber.props);
    // 3. 挂载
    // fiber.parent.dom.append(dom);
  }
}

function updateFunctionComponent(fiber) {
  fiber.props.children = [fiber.type(fiber.props)];
}

function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);
}

function updateProps(dom, props) {
  for (const prop in props) {
    if (prop !== 'children') {
      dom[prop] = props[prop];
    }
  }
}

function initChildren(fiber) {
  let prevChild = null;
  fiber.props.children.forEach((child, index) => {
    const newChild = {
      ...child,
      dom: null,
      child: null,
      sibling: null,
      parent: null
    };
    if (index === 0) fiber.child = newChild;
    else prevChild.sibling = newChild;
    newChild.parent = fiber;
    prevChild = newChild;
  });
}

/**
 * 执行当前任务
 * @param {object} work 当前要执行的任务
 * @returns 下一次要执行的任务
 */
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) updateFunctionComponent(fiber);
  else updateHostComponent(fiber);

  initChildren(fiber);

  // 5. 返回下一个任务
  if (fiber.child) return fiber.child;
  else if (fiber.sibling) return fiber.sibling;
  let parent = fiber.parent;
  while (parent) {
    if (parent.sibling) return parent.sibling;
    parent = parent.parent;
  }
  return null;
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement
};

export default React;
