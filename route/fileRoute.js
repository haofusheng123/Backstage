const express = require("express");
const fileRoure = express.Router();
const {headimg} = require("../controller/fileControl");

fileRoure.post("/headimg",headimg);

module.exports = fileRoure;