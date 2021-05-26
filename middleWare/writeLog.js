const fs = require("fs");
const path = require("path");
const moment = require("moment");
const os = require("os");

module.exports = function (req,res,next) {

    let useIp = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress;

    let name =  req.url.match(/\/(\w+)/)[1];
    // let name =  req.url;
    let date = moment().format("YYYY-MM-DD/hh-mm-ss");
    let facility = req.headers["user-agent"];
    let msg = useIp + " / " + name + " / "+ date + " / " +facility + os.EOL;
    let fileName = moment().format("YYYY_MM_DD")+".log";
    fs.appendFileSync(path.join(__dirname,"../log",fileName),msg);
    next();
}