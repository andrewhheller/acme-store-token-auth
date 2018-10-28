import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login } from '../reducers/auth';



class Login extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit(event) {
    const { onLogin } = this.props;
    const { username, password } = this.state;

    event.preventDefault();
    onLogin({ username, password })
      .catch(error => {
        console.log(error)
        this.setState({ error: 'bad credentials' })
      })
  }

  render() {
    const { handleChange, handleSubmit } = this;
    const { error } = this.state;

    return (
      <div>

        <h3>Acme Store Login</h3>

        <form onSubmit={ handleSubmit } >
          <label>Username:</label>
          <input type="text" name="username" onChange={ handleChange } />

          <br />

          <label>Password:</label>
          <input type="password" name="password" onChange={ handleChange } />

          <br />
          <br />

          <button>Login</button>
        </form>

        {
          error ? error : ''
        }

      </div>
    )
  }

}

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    onLogin: (credentials) => dispatch(login(credentials, history))
  }
}



export default connect(null, mapDispatchToProps)(Login);
