const router = require('express').Router();
const users = require('./users');

router.use('/', users);

module.exports = router;
