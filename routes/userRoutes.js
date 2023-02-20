var express = require("express");
var router = express.Router();
var {
  removeUser,
  userLogin,
  userLogout,
  registerUser,
} = require("../controller/usersController");

router.post("/users/register", registerUser);

router.post("/users/login", userLogin);

router.delete("/users/logout", userLogout);

router.delete("/users/deactivate", removeUser);

module.exports = router;
