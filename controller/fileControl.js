const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const {parse} = require("url");
module.exports = {
    headimg(req,res){
        let {query} = parse(req.url);
        let filename = qs.parse(query).filename
        let imgname = "filemodle/img/"+(Math.random()+"_").replace(".","_")+filename;
        req.pipe(fs.createWriteStream(path.join(__dirname,"../WWW",imgname)));

        req.on("end",function () {
            let rootPath = "http://10.9.47.242:3000/"+imgname;
            res.send({type:"succeed",code:200,detail:{name:"文件上传成功",value:{src:rootPath}}});
        })
    }
}