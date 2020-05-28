const express = require('express');
const router = express.Router();
const { Skill } = require('../db/models');
const passport = require('passport');

router.get(
  '/list',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    let skills = await Skill.findAll({
      attributes: ['id', 'name', 'type'],
    });
    res.status(200).json(skills);
  }
);

module.exports = router;
