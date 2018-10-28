const conn = require('./conn');

const User = conn.define('user', {

  id: {
    type: conn.Sequelize.UUID,
    defaultValue: conn.Sequelize.UUIDV4,
    primaryKey: true
  },
  
  firstName: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },

  lastName: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },

  email: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },

  username: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },

  password: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },


})


module.exports = User;
