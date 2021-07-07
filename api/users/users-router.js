// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const express = require("express");
const Users = require("./users-model");
const { restricted } = require("../auth/auth-middleware");

const router = express.Router();

router.get("/", restricted, (req, res, next) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((e) => {
      res.status(401).json({ message: e.message });
    });
});

module.exports = router;
