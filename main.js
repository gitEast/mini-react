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

function render(vnode, container) {
  // 1. 创建 dom
  const el =
    vnode.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(vnode.type);

  // 2. 处理 props
  for (const prop in vnode.props) {
    if (prop !== 'children') {
      el[prop] = vnode.props[prop];
    }
  }

  // 3.处理 props.children
  vnode.props.children.forEach((child) => render(child, el));

  // 4. 挂载
  container.append(el);
}

const appVNode = createElement('div', { id: 'app' }, 'app');

const ReactDOM = {
  createRoot(container) {
    return {
      render(vnode) {
        render(vnode, container);
      }
    };
  }
};

// 根据 React 项目格式书写
ReactDOM.createRoot(document.querySelector('#root')).render(appVNode);
