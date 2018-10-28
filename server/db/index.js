const conn = require('./conn');

const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const LineItem = require('./LineItem');

LineItem.belongsTo(Product);
LineItem.belongsTo(Order);

Order.hasMany(LineItem);

Order.belongsTo(User)
User.hasMany(Order)


const syncAndSeed = () => {

  let picard, riker, data;
  let widget1, widget2, widget3;
  let order1;

  return conn.sync({ force: true })
    .then(async () => {
      picard = await User.create({
        firstName: 'Jean-Luc',
        lastName: 'Picard',
        email: 'jpicard@enterprise.com',
        username:'jpicard',
        password: 'picard'
      }),
      riker = await User.create({
        firstName: 'William T.',
        lastName: 'Riker',
        email: 'wriker@enterprise.com',
        username:'wriker',
        password: 'riker'
      }),
      data = await User.create({
        firstName: 'Data',
        lastName: 'Soongh',
        email: 'data@enterprise.com',
        username:'data',
        password: 'data'
      })
    })
    .then(async () => {
      widget1 = await Product.create({
        name: 'widget1'
      }),
      widget2 = await Product.create({
        name: 'widget2'
      }),
      widget3 = await Product.create({
        name: 'widget3'
      })
    })
    // .then( async() => {
    //   order1 = await Order.create({
    //     userId: picard.id
    //   })
    // })
    // .then( async () => {
    //   await LineItem.create({
    //     orderId: order1.id,
    //     productId: widget1.id
    //   }),
    //   await LineItem.create({
    //     orderId: order1.id,
    //     productId: widget2.id,
    //     quantity: 3
    //   }),
    //   await LineItem.create({
    //     orderId: order1.id,
    //     productId: widget3.id,
    //     quantity: 5
    //   })
    // })
    .catch(error => console.log(error))

  }

  module.exports = {
    syncAndSeed,
    models: {
      User,
      Product,
      Order,
      LineItem
    }
  }
