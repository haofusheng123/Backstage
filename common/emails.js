const nodemailer = require("nodemailer"); //邮件模块
const mailFrom = "2597267205@qq.com";
const pass = "cautmovyrmnvdhif";


module.exports = function ({ email, subject, text, html ,callback}) {
    const transpoter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 465,
        secure: true,
        auth: {
            user: mailFrom,
            pass: pass
        }
    });
    var mailOptions = {
        from: mailFrom, // 发送者  
        to: email, // 接受者,可以同时发送多个,以逗号隔开  
        subject: subject, // 标题  
    };
    if (text != undefined) {
        mailOptions.text = text;// 文本  
    }
    if (html != undefined) {
        mailOptions.html = html;// html  
    }
    var result = {
        httpCode: 200,
        message: '发送成功!',
    }

    transpoter.sendMail(mailOptions, function (err, info) {
        if (err) {
            result.httpCode = 500;
            result.message = err;
            callback(result);
            return;
        }
        callback(result);
    });
}