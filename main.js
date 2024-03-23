const appEl = document.createElement('div');
appEl.id = 'app';
const container = document.querySelector('#root');
container.append(appEl);

const textNode = document.createTextNode('');
textNode.nodeValue = 'app';
appEl.append(textNode);
