/*
    login重定向type 
    1 : 账号或密码错误
    2 ：令牌失效
*/

const {find, updateOne,insertOne} = require("../connect/connecter");
const {encode,decode} = require("../encrypt");
const sendEmail = require("../common/emails");
const qs = require("querystring");

module.exports={
    async login(req,res){
        let option = {sheet:"user",where:{username:req.body.username,password:req.body.password}};
        let result = await find(option).catch(err => null);

        if (!result || result.length===0) {
            res.redirect("http://10.9.47.242:3000/login.html?type=1");
        }else{
            req.session['username'] = result[0].username;
            req.session['password'] = result[0].password;
            req.session['power'] = result[0].power; //将用户权限状态存储
            req.session['uid'] = result[0].uid; //将用户uid存储,用于用户页匹配
            req.session['name'] = result[0].name;
            res.redirect("http://10.9.47.242:3000/index.html");
        }
    },
    async tokenLogin(req,res){
        if (!req.session["username"] || !req.session["password"]) {
            res.send({type:"error",code:400,detail:{name:"令牌不存在",value:null}});
            return;
        }
        let option = {sheet:"user",where:{username:req.session["username"],password:req.session["password"]}};
        let result = await find(option).catch(err => null);

        if (!result || result.length===0) {
            res.send({type:"error",code:400,detail:{name:"令牌不存在",value:null}});
            return;
        }else{
            let useObj = {
                power:result[0].power,
                name:result[0].name,
                headImg:result[0].headsrc
            }
            res.send({type:"succeed",code:200,detail:{name:"用户已经登录",value:useObj}});
        }  
    },
    async register(req,res){

        let optionUser = {sheet:"user",where:{username:req.body["username"]}};
        let resultUser = await find(optionUser).catch(err => null);

        if (resultUser.length>0) {
            res.send({type:"error",code:404,detail:{name:"账号已存在",value:null}});
            return;
        }
        
        let option = {sheet:"user",value:req.body};
        let result = await insertOne(option).catch(err => null);
        
        if (result) {
            res.send({type:"succeed",code:200,detail:{name:"注册成功",value:null}})
        }else {
            res.send({type:"error",code:404,detail:{name:"注册失败",value:null}})
        }
    },
    async logout(req,res) {
        /*
            虽然删除了session映射字符串，但是在不返回响应的情况下，无法覆盖浏览器存储的session映射名
        */

        req.session['username'] = null;
        req.session['password'] = null;
        req.session['power'] = null; //将用户权限状态存储
        req.session['uid'] = null; //将用户uid存储,用于用户页匹配
        req.session['name'] = null;

        delete req.session['username'];
        delete req.session['password'];
        delete req.session['power']; //将用户权限状态存储
        delete req.session['uid']; //将用户uid存储,用于用户页匹配
        delete req.session['name'];
        res.redirect("http://10.9.47.242:3000/notLogin.html");
    },
    async findPass(req,res) {
        let option = {sheet:"user",where:{username:req.query.username,email:req.query.email}};
        let result = await find(option).catch(err => null);
        console.log(req.query);
        if (result.length>0) {
            let timer = ("fs"+Date.now()+Math.random()).replace(".","_")+"?"+"username="+result[0].username+"&"+"password="+result[0].password;
            let url = "http://10.9.47.242:3000/refreshpass?dt="+encode(timer);
            let optionemail = {
                email: result[0].email,
                subject:"fs邮件找回密码",
                html:`<a href='${url}'>点我重置密码</a>`,
                callback:(msg) => {
                    console.log(msg);
                }
            }
            sendEmail(optionemail);

        }else{
            res.send({type:"error",code:400,detail:{name:"账号或邮箱不正确",value:null}});
        }
        
    },

    /*
        重置密码
        密码重置暂时用的加密随机数的12位密匙
    */

    async refreshPass(req,res){

        let timer = decode(req.query.dt).split("?")[1];  //取的链接dt后面加密字符，解密后取的用户名密码
        let user = qs.parse(timer);
        let optionUser = {sheet:"user",where:{username:user.username,password:user.password}};  //通过用户名密码去验证身份
        let resultUser = await find(optionUser).catch(err => null);
        if (!resultUser || resultUser.length===0) {
            res.send({type:"error",code:404,detail:{name:"密码重置失败,请选择其他方式",value:null}});
            return;
        }

        let newPass = encode(("fs"+Math.random()).replace(".","_")).slice(0,12); //如果匹配成功则重置密码

        let newOption = {sheet:"user",where:{username:resultUser[0].username,password:resultUser[0].password},value:{$set:{password:newPass}}};

        let newUser = await updateOne(newOption).catch(err => null);

        res.render("token.html",{
            value:"密码重置成功,请记住您的密码: 《"+newPass+"》",
            info:"点我跳转登录",
            url:"http://10.9.47.242:3000/login.html",
            timer:"100"
        })
    }
}