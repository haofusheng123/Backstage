const qs = require("querystring");
/*
    该中间件用于post请求时将请求信息绑定到req.body中
*/

module.exports=function (req,res,next) {
    if (req.headers["file-type"]==="stream") { //如果自定义文件类型，指定的是流则，不解析文件流
        next();
        return;
    }
    if(req.method==="POST") {
        let reqData="";
        req.on("data",(_data) => {
            reqData+=_data;
        });
        req.on("end",function () {
            if (reqData,req.headers["content-type"]) {
                let data = dugerType(reqData,req.headers["content-type"]);
                req.body=data;
            }else{
                req.body=reqData;
            }
            next();
        });
    }else{
        next();
    }
}

function dugerType(reqData,type) {
    switch (type.split("; ")[0]){
        case "application/x-www-form-urlencoded":
            return qs.parse(reqData);
        default:
            return reqData;
    }
}