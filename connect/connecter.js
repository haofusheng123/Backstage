

/*
    在进行更新时对字段进行检测

    在做一个回收站恢复删除的用户信息

*/


const mongodb = require("mongodb"); //引入mongodb数据库
const dbname="fsdb";
let url;
if (process.env.NODE_ENV=="dev") { //开发环境连接数据库
    url = "mongodb://localhost:27017";
}else if (process.env.NODE_ENV=="build"){ //生产环境连接服务器
    // url ="";
}else {
    throw new Error("数据库连接失败 : 请确定该测试环境是否存在");
}
const client = new mongodb.MongoClient(url,{ useUnifiedTopology: true }); //建立数据库连接的方式

module.exports={
    async find(option){
        return new Promise((fulfill,reject) => { //创建一个promise对象,用于外部await调用
            client.connect(function (err) {  //与mongodb建立连接
                if (err) reject(err); 
                let db = client.db(dbname);  //连接库
                db.collection(option.sheet).find(option.where).toArray((err,data) => { //进行数据表操作
                    if (err) reject(err);
                    else fulfill(data);
                });
            });
        })
    },
    async insertOne(option){
        return new Promise((fulfill,reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                let db = client.db(dbname);
                db.collection(option.sheet).insertOne(option.value,function (err,res) {
                    if (err) reject(err);
                    else fulfill(res)
                })
            })
        });
    },

    /*
        要是用软删除，逻辑删除update
    */
    async deleteOne(option){
        return new Promise((fulfill,reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                let db = client.db(dbname);

                // 换成更新状态
                db.collection(option.sheet).deleteOne(option.where,function (err,res) {
                    if (err) reject(err);
                    else fulfill(res)
                });
            })
        });
    },

    async updateOne(option){
        return new Promise((fulfill,reject) => {
            client.connect(function (err) {
                if (err) reject(err);
                let db = client.db(dbname);
                console.log(option);
                db.collection(option.sheet).updateOne(option.where,option.value,function (err,res) {
                    if (err) reject(err);
                    else fulfill(res)
                })
            })
        })
    }
}