import axios from 'axios';

import { loadOrders } from './orders';
import { createCart } from './cart';

// action constants
const SET_AUTH = 'SET_AUTH';
const REMOVE_AUTH = 'REMOVE_AUTH';



// action creators
const _setAuth = user => {
  return {
    type: SET_AUTH,
    user
  }
}

const _removeAuth = () => {
  return {
    type: REMOVE_AUTH
  }
}



//thunks
const exchangeTokenForAuth = () => {
  return (dispatch) => {
    const token = window.localStorage.getItem('token');

    if(!token) {
      return;
    }

    return axios.get('/api/auth', {
      headers: {
        authorization: token
      }
    })
    .then(response => response.data)
    .then(auth => dispatch(_setAuth(auth)))
    .then(() => dispatch(createCart()))
    .then(() => dispatch(loadOrders()))
    .catch(error => {
      console.log(error)
      window.localStorage.removeItem('token')
    })
  }
}

const login = (credentials, history) => {
  return (dispatch) => {
    return axios.post('/api/auth', credentials)
      .then(response => response.data)
      .then(data => {
        window.localStorage.setItem('token', data.token)
        dispatch(exchangeTokenForAuth())
        history.push('/')
      })
      // .catch(error => console.log(error))
  }
}

const logout = (history) => {
  return (dispatch) => {
    window.localStorage.removeItem('token');
    dispatch(_removeAuth());
    history.push('/login')
  }
}

// reducer
const authReducer = (state = {}, action) => {

  switch(action.type) {

    case SET_AUTH:
      state = action.user
      break;

    case REMOVE_AUTH:
      state = {}
      break;
  }

  return state;
}

export {
  authReducer,
  login,
  exchangeTokenForAuth,
  logout
}
