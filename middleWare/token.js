/*
    token中间件，由于是后台管理，在任何网络操作前，都要先验证身份，在请求资源与路由时如果没有令牌，或者令牌失效，则跳转登录页
    他不会拦截除html以外的网络资源，与login登录页
*/


const {find} = require("../connect/connecter");
const {parse} = require("url");
const path = require("path");
module.exports=async function (req,res,next) {
    let username=req.session["username"];
    let password=req.session["password"];
    if (!username || !password) { //如果token令牌不存在则直接返回登录页
        res.redirect("http://10.9.47.242:3000/notLogin.html");
        return;
    };
    let option = {sheet:"user",where:{username:req.session["username"],password:req.session["password"]}};
    let result = await find(option).catch(err => null);
    if (!result || result.length===0) {

        res.redirect("http://10.9.47.242:3000/notLogin.html");
        return;
    }
    next();
}