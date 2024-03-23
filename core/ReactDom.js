import React from './React.js';

const ReactDOM = {
  createRoot(container) {
    return {
      render(vnode) {
        React.render(vnode, container);
      }
    };
  }
};

export default ReactDOM;
