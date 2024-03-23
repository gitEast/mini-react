import React from './core/React.js';
import ReactDOM from './core/ReactDom.js';

// 将 appVNode 改名为 App
const App = React.createElement('div', { id: 'app' }, 'app');

// 根据 React 项目格式书写
ReactDOM.createRoot(document.querySelector('#root')).render(App);
