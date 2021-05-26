const express = require("express");
const route = express.Router();
const { login, tokenLogin, register, logout ,findPass,refreshPass} = require("../controller/loginControl.js");

route.get("/tokenlogin", tokenLogin);
route.get("/logout", logout);
route.post("/login", login);
route.post("/register", register);
route.get("/findpass", findPass);
route.get("/refreshpass", refreshPass);



module.exports = route;