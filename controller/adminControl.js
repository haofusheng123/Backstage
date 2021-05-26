/*
    所有操作均在token验证成功的情况下可以执行

    需要在操作数据库时进行防呆操作，不然可能会向数据库添加一些错误的数据
*/
const {find,insertOne,deleteOne,updateOne} = require("../connect/connecter"); //引入数据库操作模块
const {encode,decode} = require("../encrypt"); //引入加入模块
const path = require("path");
const moment = require("moment");

module.exports = {
    
    /*
        通过session中的来获取用户信息
    */

    async getuser(req,res) { //登录以后重定向的路由，用于返回渲染页面，根据动态路由来决定用户
        let option = {sheet:"user",where:{username : req.session["username"],password:req.session["password"]}};
        let result = await find(option).catch(err => null);

        let userInfo = Object.assign({
            site:"未定位",
            info:"快去完善自己的资料吧",
            like:{list:Array(10).fill(0),num:0},
            beLike:{list:Array(10).fill(0),num:0},
            article:{list:Array(10).fill(0),num:0},
        },result[0]);
        res.render("user.html", {
            email:result[0].email,
            userInfo:userInfo,
            uid:encode(result[0].uid),
            like:userInfo.like.list+"",
            beLike:userInfo.beLike.list+"",
            article:userInfo.article.list+""
        });
    },

    /*
        完善修改用户的资料
    */


    async changeUser(req,res) {
        let option = {sheet:"user",where:{username : req.session["username"],password:req.session["password"]}};
        let result = await find(option).catch(err => null);
        res.render("changeuser.html",result[0])
    },


    async changeUserMsg(req,res) {
        let userValue = {name:req.body.name,lastTime:req.body.lastTime,phone:req.body.phone,email:req.body.email}
        let result = await updateOne({sheet:"user",where:{username : req.session["username"],password:req.session["password"]},value:{$set:userValue}}).catch(err => null);
        if (!result) {
            res.send({type:"error",code:404,detail:{name:"更新失败",value:null}})
        }else {
            res.send({type:"succeed",code:200,detail:{name:"更新成功",value:null}})
        }
    },

    /*
        查看项目通过token来验证，
        通过session中的power来查找用户可以操作和查看的其他用户，
        同级权限可以查看，下级权限可以进行删除修改操作
    */

    async project(req,res){
        let option = {sheet:"project",where:{power : {$gte:req.session["power"]}}};
        let result = await find(option).catch(err => null);

        res.render("project.html", {
            name: req.session["name"],
            power:req.session["power"],
            userList:result,
            pidList:result.map(item => encode(item.pid)),
            status: result[0] ? result[0].status==="pendding" ? "进行中" : result[0].status==="fulfill" ? "完成" : "未完成" : ""
        });
    },

    /*
        项目数据接口
        name: string => 项目联系人
        title: string => 项目标题
        info: string => 项目详情
        user: string => 检测账号
        pass: string => 检测密码
        phone: string => 联系人手机
        email: string => 公司邮箱
        pid: number => 项目id (暂时永用户id后二位与时间戳来表示)
        addTime: string => 注册时间
        power: number => 权限
        plan: string => 进度
        aName: string => 负责人
    */

    async addProject(req,res) {

        let keyList = ["title","desc","user","pass","phone","email"];
        if (!req.body || typeof req.body!=="object") {
            res.send({type:"error",code:404,detail:{name:"参数错误",value:null}});
            return;
        }
        for (var i=0;i<keyList.length;i++) { //检验参数
            if (!req.body[keyList[i]]) {
                res.send({type:"error",code:404,detail:{name:"参数不足",value:null}});
                return;
            }
        }

        let userOption = {sheet:"user",where:{username : req.body.user,password:req.body.pass}};
        let userResult = await find(userOption).catch(err => null);
        if (!userResult || userResult.length===0) {
            res.send({type:"error",code:404,detail:{name:"账号或者密码错误",value:null}});
            return;
        }
        
        let data = Object.assign({
            aName:userResult[0].name,
            power:userResult[0].power,
            addTime:moment().format("YYYY年MM月DD日 hh:mm"),
            updateTime:moment().format("YYYY年MM月DD日 hh:mm"),
            plan:0,
            pid:parseInt((""+Date.now()+Math.random()).replace(".","").slice(8).slice(0,-8)),
        },req.body);

        let option = {sheet:"project",value:data};
        let result = await insertOne(option).catch(err => null);
        if (result) {
            res.send({type:"succeed",code:200,detail:{name:"添加项目成功",value:null}});
        }else {
            res.send({type:"error",code:404,detail:{name:"添加项目失败",value:null}})
        }
    },

    /*
        验证是否有token有的话跳转到用户页
        没有的话跳转到主页，等待登录
        因为需要有用户的uid进行比对，a链接显示部分id要进行加密
    */

    // skipUser(req,res,next){
    //     if (req.session["username"] && req.session["password"]) {
    //         res.redirect("http://10.9.47.242:3000/admin/getuser");
    //     }else{
    //         next();
    //     }
    // },


    async updateUser(req,res) {
        let pid = +decode(path.basename(req.url));
        let option = {sheet:"project",where:{pid : pid}};
        let result = await find(option).catch(err => null);
        res.render("redact.html",{
            user:result[0].aName,
            title:result[0].title,
            info:result[0].info,
            desc:result[0].desc,
            plan:result[0].plan,
            phone:result[0].phone,
            email:result[0].email
        });
    },

    async saveProject(req,res) {
        let pid = +decode(req.params.pid);
        let newDate = { //更新内容
            updateTime:moment().format("YYYY年MM月DD日 hh:mm"),
            aName:req.body.user,
            title:req.body.title,
            plan:+req.body.plan,
            info:req.body.info,
            phone:req.body.phone,
            desc:req.body.desc
        }


        let option = {sheet:"project",where:{pid : pid},value:{$set:newDate}};
        let result = await updateOne(option).catch(err => null);
        
        if (!result) {
            res.send({type:"error",code:404,detail:{name:"更新失败",value:null}})
        }else {
            res.send({type:"succeed",code:200,detail:{name:"更新成功",value:null}})
        }
    },

    async deleteUser(req,res) {
        let pid = +decode(path.basename(req.url));
        let option = {sheet:"project",where:{pid : pid}};
        let result = await deleteOne(option).catch(err => null);
        res.redirect("http://10.9.47.242:3000/admin/project");
    },

    /*
        查看用户的信息根据uid进行查找
    */

    async findUser(req,res) {
        let pid = +decode(path.basename(req.url));
        let option = {sheet:"project",where:{pid : pid}};
        let result = await find(option).catch(err => null);
        res.render("userinfo.html",{
            userInfo:result[0],
            status: result[0] ? result[0].status==="pendding" ? "进行中" : result[0].status==="fulfill" ? "完成" : "未完成" : "",
            cPid:path.basename(req.url)
        });
    },

    /*
        修改密码
    */

    async changePass (req,res) {
        let {username,password,newpass} = req.body;
        console.log(req.body);
        if (!username || !password) {
            res.send({type:"error",code:404,detail:{name:"账号或密码为必填项",value:null}});
            return;
        }

        let option = {sheet:"user",where:{username : username,password:password}};
        let result = await find(option).catch(err => null);

        if (!result || result.length===0) {
            res.send({type:"error",code:404,detail:{name:"账号密码错误",value:null}});
            return;
        }

        let passOption = {sheet:"user",where:{username : username,password:password},value:{$set:{password:newpass}}};
        let passResult = await updateOne(passOption).catch(err => null);

        if (passResult){
            res.send({type:"succeed",code:200,detail:{name:"密码重置成功",value:null}});
        }else{
            res.send({type:"error",code:404,detail:{name:"密码重置失败",value:null}});
        }
    }
}