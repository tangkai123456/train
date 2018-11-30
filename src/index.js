import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

const render = () => {
  // eslint-disable-next-line global-require
  const App = require('./Router').default;
  ReactDOM.render(<AppContainer><App /></AppContainer>, document.getElementById('root'));
};

render();
if (module.hot) {
  module.hot.accept(render);
}
