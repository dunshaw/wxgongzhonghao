
/* 验证服务器有效性模块*/

const sha1 = require('sha1'); 
// 配置对象
const config = require('../config');


module.exports = () => {
    return (req,res,next)=>{
        console.log(req.query);
        //微信服务器提交的参数
        // { sigmature:'sdsdfdsfddsff324324dsfdsfsdf',  微信的加密签名        
        // echostr:'32434324324324324234',              微信的随机字符串 
        // timestamp:'1234323',                         微信的发送请求时间戳
        // nonce:'113435343' }                          微信的随机数字
    
        const { sigmature, echostr,timestamp, nonce} = req.query;
        const { token }  = config;
        // 1. 将参与微信加密签名的三个参数(sigmature,nonce,token)按照字典排序并组合在一起形成一个数组
        const arr = [sigmature,nonce,token];
        const arrSort = arr.sort();
        console.log(arrSort);         
        // 2. 将数组中所有参数拼接成一个字符串，进行sha1加密
        const str = arr.join('');
        const sha1str = sha1(str);
        // 3. 验证是否与微信服务器发送的加密签名一样
        if(sha1str === sigmature){
            res.send(echostr);
        }else{
            res.end('error');
        }
    }
}