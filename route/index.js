const express = require("express");
const route = express.Router();

/*
    各功能路由组件引入
*/
const loginRoute = require("./loginRoute"); //登陆功能路由
const adminRoute = require("./adminRoute"); //用户操作路由
const fileRoute = require("./fileRoute"); //文件上传路由

/*
    中间件的引入
*/
const reqBody = require("../middleWare/req-body");
const token = require("../middleWare/token");

route.use(reqBody); //绑定post请求体中间件


/*
    在使用中间件时要注意，中间件use、post、get会将req上面的匹配路由截掉，在后面匹配的是剩下的路由部分
    如果写入匹配路由在下一次个中间件时要将上一个匹配路由去掉，只留下后面路由
*/

route.use(loginRoute);
route.use("/upload",fileRoute);
route.use("/admin",token,adminRoute);

module.exports=route;