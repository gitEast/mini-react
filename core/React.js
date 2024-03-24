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
  if (!work.dom) {
    // 1. 创建 dom
    const el = (work.dom =
      work.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(work.type));

    // 2. 处理 props
    for (const prop in work.props) {
      if (prop !== 'children') {
        el[prop] = work.props[prop];
      }
    }

    // 3. 挂载
    work.parent.dom.append(el);
  }

  // 4.处理 props.children
  let prevChild = null;
  work.props.children.forEach((child, index) => {
    if (index === 0) work.child = child;
    else prevChild.sibling = child;
    child.parent = work;
    prevChild = child;
  });

  if (work.child) return work.child;
  else if (work.sibling) return work.sibling;
  return work.parent.sibling;
}

const React = {
  render,
  createElement
};

export default React;
