const express = require('express');
const router = express.Router();
const { Domain } = require('../db/models');
const passport = require('passport');

router.get(
  '/list',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    let domains = await Domain.findAll({
      attributes: ['id', 'name'],
    });
    res.status(200).json(domains);
  }
);

module.exports = router;
