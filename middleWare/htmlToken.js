

const {find} = require("../connect/connecter");
const {parse} = require("url");
const path = require("path");
module.exports=async function (req,res,next) {
    if (path.basename(req.url) === "favicon.ico") {
        res.send();
        return;
    }
    if (path.basename(req.url) === "notLogin.html" || path.basename(req.url) ==="login.html" || path.basename(req.url) ==="register.html") {
        next();
        return;
    }
    if (req.url==="/"){
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
    }
    next();
}