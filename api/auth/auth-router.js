// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require("express");
const bcrypt = require("bcryptjs");
const {
  checkPayload,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require("./auth-middleware");
const { add, findBy } = require("../users/users-model");

const router = express.Router();

router.post(
  "/register",
  checkPasswordLength,
  checkUsernameFree,
  (req, res, next) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    add({ username: username, password: hash })
      .then((registeredUser) => {
        res.status(200).json(registeredUser);
      })
      .catch(next);
  }
);

router.post(
  "/login",
  checkPayload,
  checkUsernameExists,
  async (req, res, next) => {
    // const { username, password } = req.body;
    // const [user] = await findBy({ username });
    // if (user && bcrypt.compareSync(password, user.password)) {
    //   req.session.user = user;
    //   res.status(200).json(`Welcome ${username}`);
    // } else {
    //   res.status(401).json("Invalid credentials");
    // }
    try {
      const verified = bcrypt.compareSync(
        req.body.password,
        req.userData.password
      );
      if (verified) {
        req.session.user = req.userData;
        res.status(200).json(`Welcome ${req.userData.username}`);
      } else {
        res.status(401).json("Invalid credentials");
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json("Sorry cant log out" + err.message);
      } else {
        res.status(200).json("logged out");
      }
    });
  } else {
    res.status(200).json("no session");
  }
});
module.exports = router;

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

// Don't forget to add the router to the `exports` object so it can be required in other modules
