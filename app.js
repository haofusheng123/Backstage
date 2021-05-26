/*
    用户界面管理是用自己的服务器访问不涉及跨域问题
*/


const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieSession = require("cookie-session"); //session状态存储机制
const route = require("./route/index"); //主路由文件导入
const app = express();
const artTemplate = require("express-art-template"); //引入模板引擎模块

const htmlToken = require("./middleWare/htmlToken");

app.listen(3000,"10.9.47.242",function(){
    console.log("请访问: http://10.9.47.242:3000");
});


/*
    第三方中间件引入
*/

app.use(cookieSession({
    name:"fssession",
    secret:"haofusheng", //加密字符串
    httpOnly:true //不允许脚本操作cookie，避免xss攻击
}));

app.engine("html",artTemplate); //以html格式进行模板引擎渲染
app.set("views",path.join(__dirname,"views")); //设置模板引擎查找的根目录

/*
    内置中间件引入
*/

app.use(htmlToken);

app.use(express.static("WWW")); //静态服务器搭建

app.use(route); //路由模块引入

app.use((req,res) => res.redirect("http://10.9.47.242:3000/error.html")); //异常请求处理