const express = require('express');
const router = express.Router();

const { Order, LineItem } = require('../db').models;


// get all orders
router.get('/', (req, res, next) => {
  Order.findAll({
    include: [ LineItem ],
    order: [[ 'createdAt', 'DESC' ]]
  })
    .then(orders => res.send(orders))
    .catch(error => next(error))
})


// ### ORDERS BY USERS ###

// lock down API middlware
const loggedIn = (req, res, next) => {
  console.log(req.user)
  next(req.user ? null : { status: 401 })
}

const isMe = paramKey => {
  return (req, res, next) => {
    next(req.user.id === req.params[paramKey] ? null : { status: 401 })
  }
}

// get all orders by user ID
router.get('/users/:userId', loggedIn, (req, res, next) => {
  Order.findAll({
    where: {
      userId: req.params.userId
    },
    include: [ LineItem ],
    order: [[ 'createdAt', 'DESC' ]]
  })
  .then(orders => res.send(orders))
  .catch(error => next(error))
})









// this will first see if there is a cart and return that order, or if not
// create a new order (default status is CART)
router.get('/cart/:userId', (req, res, next) => {
  // console.log(req.params.userId)
  Order.findOne({
    where: {
      status: 'CART',
      userId: req.params.userId
    }
  })
    .then(cart => {
      if(!cart) {
        return Order.create({
          userId: req.params.userId
        })
          .then(order => res.send(order))
      }
      else {
        res.send(cart)
      }
    })
    .catch(error => next(error));
})

// create an order
router.post('/', (req, res, next) => {
  Order.create()
    .then(order => res.send(order))
    .catch(error => next(error))
})

// update order (status)
router.put('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .then(order => order.update(req.body))
    .then(order => res.send(order))
    .catch(error => next(error))
})

// create a line item
router.post('/:orderId/lineItems', (req, res, next) => {
  LineItem.create({
    orderId: req.params.orderId,
    quantity: req.body.quantity,
    productId: req.body.productId
  })
    .then(lineItem => res.send(lineItem))
    .catch(error => next(error))
})

// update a line item
router.put('/:orderId/lineItems/:lineItemId', (req, res, next) => {
  LineItem.findById(req.params.lineItemId)
    .then(lineItem => lineItem.update(req.body))
    .then(lineItem => res.send(lineItem))
    .catch(error => next(error))
})

// delete all products from line items
router.delete('/:orderId/lineItems/products/:productId', (req, res, next) => {
  LineItem.destroy({
    where: {
      productId: req.params.productId
    }
  })
  .then(() => res.sendStatus(204))
  .catch(error => next(error))
})

// delete a line item
router.delete('/:orderId/lineItems/:lineItemId', (req, res, next) => {
  LineItem.destroy({
    where: {
      id: req.params.lineItemId
    }
  })
  .then(() => res.sendStatus(204))
  .catch(error => next(error))
})

// delete all records in Order table (cascade into LineItem)
router.delete('/reset', (req, res, next) => {
  Order.destroy({
    where: {},
    cascade: true,
    truncate: true
  })
  .then(() => res.sendStatus(204))
  .catch(error => next(error))
})



module.exports = router;
