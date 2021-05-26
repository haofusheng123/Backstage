const express = require("express");
const adminRoute = express.Router();
const { getuser, updateUser, deleteUser, findUser, project, addProject, saveProject, changeUser ,changeUserMsg,changePass} = require("../controller/adminControl");
const writeLog = require("../middleWare/writeLog");

// adminRoute.get("/",skipUser);

/*
    使用动态路由
*/

adminRoute.use(writeLog);

adminRoute.get("/update/:uid", updateUser);
adminRoute.get("/delete/:uid", deleteUser);
adminRoute.get("/find/:uid", findUser);
adminRoute.post("/saveproject/:pid", saveProject);



adminRoute.get("/getuser", getuser);
adminRoute.get("/project", project);
adminRoute.post("/addproject", addProject);
adminRoute.get("/changeuser", changeUser);
adminRoute.post("/changeusermsg", changeUserMsg);
adminRoute.post("/changepass", changePass);

module.exports = adminRoute;