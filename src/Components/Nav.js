import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import store from '../store';
import { _setCount } from '../reducers/count';
import { logout } from '../reducers/auth';

const Nav = ({ cartCount, orderCount, location, isLoggedIn, auth, onLogout }) => {

  // conditional active nav link formatting
  const selected = (currentPath) => {
    if(currentPath === location.pathname) {
      return "selected"
    }
  }
  
  return (
    <ul className="nav nav-tabs nav-fill">

      {/* visible to both authenticated and unauthenticated users */}
      <Link className="nav-link" to="/">
        <li className={ selected('/') } >Home</li>
      </Link>
  
      {/* only visible to authenticated users */}

      {
        isLoggedIn && (

          <Fragment>

            <Link className="nav-link" to="/cart">
              <li className={ selected('/cart') }>
                Cart
                ({ cartCount ? cartCount : 0 })
              </li>
            </Link>

            <Link className="nav-link" to="/orders">
              <li className={ selected('/orders') } >
                Orders
                ({ orderCount ? orderCount : 0 })
              </li>
            </Link>

          </Fragment>

        )
      }


      {
        isLoggedIn ?
          <li className="nav-link" onClick={() => onLogout()} >
              Logout ({ auth.lastName })
          </li>
          :
          <Link to="/login">
            <li className="nav-link">
              Login
            </li>
          </Link>
      }

    </ul>
  )
}

const mapStateToProps = ({ orders, auth }) => {
  
  // ### determine number of orders in cart ###

  // find order with status of CART
  const cart = orders.find(order => order.status === 'CART');

  // add all quantities in the cart
  const cartCount = () => {
    const count = cart ? 
      cart.lineItems.reduce((total, item) => {
        total += item.quantity
        return total
      }, 0)
    : ''

    // add this value to the store
    store.dispatch(_setCount(count));

    return count;
  }

  // ### determine number of orders in cart ###

  // find all orders with status of ORDER
  const orderCount = orders.filter(order => order.status === 'ORDER').length;

  return {
    cartCount: cartCount(),
    orderCount,
    isLoggedIn: auth.id,
    auth
  }
}

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    onLogout: () => dispatch(logout(history))
  }
} 


export default connect(mapStateToProps, mapDispatchToProps)(Nav);
