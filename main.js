/**
 * 将节点抽象成虚拟节点
 */
const appVNode = {
  type: 'div',
  props: {
    id: 'app',
    children: ['app']
  }
};
const appEl = document.createElement('div');
appEl.id = 'app';
const container = document.querySelector('#root');
container.append(appEl);

const textVNode = {
  type: 'TEXT_ELEMENT', // 意为文本节点
  props: { nodeValue: 'app' }
};
const textNode = document.createTextNode('');
textNode.nodeValue = 'app';
appEl.append(textNode);
