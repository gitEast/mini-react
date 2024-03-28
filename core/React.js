/**
 * 创建虚拟节点
 * @param {string} type dom 类型
 * @param {object} props 属性
 * @param  {...any} children
 * @returns 虚拟节点
 */
function createElement(type, props, ...children) {
  function convertElement(child) {
    return typeof child === 'object' ? child : createTextNode(child);
  }
  return {
    type,
    props: {
      ...props,
      children: children.reduce((prev, child) => {
        if (Array.isArray(child))
          return [...prev, ...child.map((c) => convertElement(c))];
        return [...prev, convertElement(child)];
      }, [])
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
 * 下一次要执行的任务
 */
let nextWorkOfUnit = null;
/**
 * 本次统一提交的根节点
 */
let wipRoot = null;
/**
 * update 时要使用的 root
 */
let currentRoot = null;
/**
 * 记录要删除的 fiber
 */
const deletions = [];

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

  wipRoot = nextWorkOfUnit;
}

function update() {
  nextWorkOfUnit = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  };
  wipRoot = nextWorkOfUnit;
}

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

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  deletions.forEach((child) => commitDeletion(child));
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions.length = 0;
}

function commitDeletion(fiber) {
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    fiberParent.dom.removeChild(fiber.dom);
  }
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    if (fiber.effectTag === 'REPLACEMENT') {
      fiberParent.dom.append(fiber.dom);
    } else updateProps(fiber.dom, fiber.props, fiber.alternate.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateHostComponent(fiber) {
  if (fiber.type !== fiber.alternate?.type || !fiber.alternate) {
    if (!fiber.dom) {
      // 1. 创建 dom
      const dom = (fiber.dom = createDom(fiber.type));
      // 2. 处理 props
      updateProps(dom, fiber.props);
    }
  } else {
    fiber.dom = fiber.alternate.dom;
  }
  updateChildren(fiber, fiber.props.children);
}

function updateFunctionComponent(fiber) {
  updateChildren(fiber, [fiber.type(fiber.props)]);
}

function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps = {}) {
  for (const prop in prevProps) {
    if (!(prop in prevProps)) {
      if (prop.startsWith('on')) {
        const eventType = prop.slice(2).toLowerCase();
        dom.removeEventListener(eventType, prevProps[prop]);
      } else {
        dom.removeAttribute(prevProps[prop]);
      }
    }
  }

  for (const prop in nextProps) {
    if (prop !== 'children') {
      if (nextProps[prop] !== prevProps[prop]) {
        if (prop.startsWith('on')) {
          const eventType = prop.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[prop]);
          dom.addEventListener(eventType, nextProps[prop]);
        } else {
          dom[prop] = nextProps[prop];
        }
      }
    }
  }
}

function updateChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    let newFiber;
    const isSameType = oldFiber && oldFiber.type === child.type;
    if (isSameType) {
      newFiber = {
        ...child,
        dom: null,
        child: null,
        sibling: null,
        parent: fiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      };
    } else {
      newFiber = {
        ...child,
        dom: null,
        child: null,
        sibling: null,
        parent: fiber,
        effectTag: 'REPLACEMENT'
      };
      oldFiber && deletions.push(oldFiber);
    }
    if (index === 0) fiber.child = newFiber;
    else prevChild.sibling = newFiber;
    oldFiber = oldFiber?.sibling;
    prevChild = newFiber;
  });

  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
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
  createElement,
  update
};

export default React;
