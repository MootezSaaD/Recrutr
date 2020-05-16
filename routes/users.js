const express = require('express');
const router = express.Router();
const UsersService = require('../services/users.service')();
const passport = require('passport');

router.post('/register', async (req, res, next) => {
  const resBody = req.body;
  try {
    const user = await UsersService.register(resBody);
    res.json({ success: true, msg: 'User registered' });
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Failed to register' });
  }
});

router.post('/authenticate', async (req, res, next) => {
  const resBody = req.body;
  try {
    const { user } = await UsersService.login(resBody);
    res.json(user);
  } catch (err) {
    res.status(400).json({ success: false, msg: 'Failed to login' });
  }
});

module.exports = router;
