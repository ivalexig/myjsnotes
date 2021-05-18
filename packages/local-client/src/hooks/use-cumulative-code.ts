import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';

        const root = document.querySelector('#root');

        var show = (value) => {
          if (typeof value === 'object'){
            if (value.$$typeof && value.props) {
              _ReactDOM.render(value, root); 
            } else {
              root.innerHTML = JSON.stringify(value)
            }   
          } else {
            root.innerHTML = value;
          }
        }
      `;
    const showFuncBlank = 'var show = () => {}';
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        cumulativeCode.push(c.id === cellId ? showFunc : showFuncBlank);
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }

    return cumulativeCode;
  }).join('\n');
};
