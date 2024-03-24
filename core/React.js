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
}

/**
 * 下一次要执行的任务
 */
let nextWorkOfUnit = null;

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

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/**
 * 执行当前任务
 * @param {object} work 当前要执行的任务
 * @returns 下一次要执行的任务
 */
function performWorkOfUnit(work) {
  // 目前是为了入口 render 的 container 节点做适配
  if (!work.dom) {
    // 1. 创建 dom
    const dom = (work.dom = createDom(work.type));
    // 2. 处理 props
    updateProps(dom, work.props);
    // 3. 挂载
    work.parent.dom.append(dom);
  }

  // 4.处理 props.children
  initChildren(work);

  // 5. 返回下一个任务
  if (work.child) return work.child;
  else if (work.sibling) return work.sibling;
  return work.parent.sibling;

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

  function initChildren(work) {
    let prevChild = null;
    work.props.children.forEach((child, index) => {
      if (index === 0) work.child = child;
      else prevChild.sibling = child;
      child.parent = work;
      prevChild = child;
    });
  }
}

const React = {
  render,
  createElement
};

export default React;
