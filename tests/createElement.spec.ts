import { describe, it, expect } from 'vitest';
import React from '../core/React';

describe('createElement', () => {
  it('it should return virtual dom for element', () => {
    const vnode = React.createElement('div', { id: 'app' }, 'app');
    expect(vnode).toMatchInlineSnapshot(`
    {
      "props": {
        "children": [
          {
            "props": {
              "children": [],
              "nodeValue": "app",
            },
            "type": "TEXT_ELEMENT",
          },
        ],
        "id": "app",
      },
      "type": "div",
    }
  `);
  });
});
