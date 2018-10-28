import React, { Component, Fragment } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadProducts } from '../reducers/products';
import { loadOrders } from '../reducers/orders';
import { createCart } from '../reducers/cart';
import { exchangeTokenForAuth } from '../reducers/auth';

import Nav from './Nav';
import Header from './Header';
import Login from './Login';
import Products from './Products';
import Cart from './Cart'
import Orders from './Orders';


class App extends Component {

  componentDidMount() {
    const { onInit } = this.props;

    onInit();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <Router>
        <div className="main">

          {/* all users */}
          <Route path="/" component={Nav} />

          {/* authenticated users only */}
          {
            isLoggedIn && (
              <Route path="/" component={Header} />
            )
          }
        
          {/* all users */}
          <Switch>
            <Route exact path="/login" component={Login} />

            {/* authenticated users only */}
            {
              isLoggedIn && (
                <Fragment>
                  <Route exact path="/" component={Products} />
                  <Route exact path="/cart" component={Cart} />
                  <Route exact path="/orders" component={Orders} />
                </Fragment>
              )
            }

          </Switch>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    isLoggedIn: auth.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInit: () => {
      dispatch(loadProducts()),
      // dispatch(loadOrders()),
      dispatch(exchangeTokenForAuth())
      // dispatch(createCart())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
