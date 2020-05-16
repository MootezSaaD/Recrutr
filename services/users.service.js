const sequelize = require('sequelize')
const { User } = require('../db/models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/env')

function usersService() {
  
  async function getUserById(id) {
    return User.findOne( { where:{ id: id } })
  }

  async function addUser(userData) {
    return User.create(userData);
  }

  async function getUserByEmail(email) {
    const query = { email: email };
    return User.findOne({ where: query });
  }

  async function register(resBody) {
    let newUser = {
      firstName: resBody.firstName.trim(),
      lastName: resBody.lastName.trim(),
      email: resBody.email.trim(),
      password: ''
    };
    let hash = bcrypt.hashSync(resBody.password, 10)
    newUser.password = hash;
    await addUser(userData);
  }

  async function login(resBody) {
    const user = await getUserByEmail(resBody.email);
    if (!user) {
      throw Error('User not found');
    }
    const match = await bcrypt.compare(resBody.password, user.password);
    if (!match) throw Error;
    const token = jwt.sign(user.toJSON(), config.secret, {
      expiresIn: 3600
    });
    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: token
      }
    };
  }

  return {
    getUserById,
    getUserByEmail,
    addUser,
    register,
    login
  };
}

module.exports = usersService;
