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
      children
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

function render(vnode) {}

const textVNode = createTextNode('app');
const appVNode = createElement('div', { id: 'app' }, textVNode);
const appEl = document.createElement(appVNode.type);
appEl.id = appVNode.props.id;
const container = document.querySelector('#root');
container.append(appEl);

const textNode = document.createTextNode('');
textNode.nodeValue = textVNode.props.nodeValue;
appEl.append(textNode);
