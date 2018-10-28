// modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jwt-simple')

// data models
const { User } = require('./db').models;

// routes
const apiProducts = require('./api/products');
const apiOrders = require('./api/orders');
const apiAuth = require('./api/auth');

// instantiate app
const app = express();



// ### MIDDLEWARE ###

// static resources
app.use(express.static('public'));
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// token
app.use((req, res, next) => {
  const token = req.headers.authorization;
  // console.log(token)

  if(!token) {
    return next();
  }

  let id;
  try {
    id = jwt.decode(token, process.env.JWT_SECRET).id;
    User.findById(id)
      .then(user => {
        if(!user) {
          return next({ status: 401 })
        }

        req.user = user;
        next();
      })
      .catch(error => next(error))
  }
  catch(error) {
    next({ status: 401 })
  }
})

// routing
app.use('/api/products', apiProducts);
app.use('/api/orders', apiOrders);
app.use('/api/auth', apiAuth);

// ### ROUTES ###

// grab files
const index = path.join(__dirname, '..', 'index.html')
const errorPage = path.join(__dirname, '..', '404.html');

app.get('/', (req, res, next) => {
  res.sendFile(index)
});




// ### ERROR HANDLING ###
app.use((req, res, next) => {
  res.status(404).sendFile(errorPage);
});

app.use((error, req, res, next) => {
  console.log(error)
  res.status(error.status || 500).send('<h1>There was an Error</h1>')
})

module.exports = app;
