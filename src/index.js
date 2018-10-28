import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';

import App from './Components/App';


// console.log(store.getState());


const root = document.getElementById('root');

render(
<Provider store={store} >
  <App />
</Provider>
, root)