import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { loadCoreData } from './utils/sheets';

loadCoreData().then((globalData: any) => {
  ReactDOM.render(<App globalData={globalData}/>, document.getElementById('root'));
}).catch((err) => {
  console.log(err);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
