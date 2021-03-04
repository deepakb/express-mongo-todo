const router = require('express').Router();
const mongoose = require('mongoose');

const User = mongoose.model('User');

router.post('/users', (req, res, next) => {
  const user = new User();
  const { userName, email, password } = req.body;
  const { hash, salt } = user.setPassword(password);

  user.userName = userName;
  user.email = email;
  user.hash = hash;
  user.salt = salt;

  throw new Error('Hello Error');

  user
    .save()
    .then(() => res.json({ user }))
    .catch(next);
});

module.exports = router;
