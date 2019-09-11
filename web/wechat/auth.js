
/* 验证服务器有效性模块*/

const sha1 = require('sha1'); 
// 配置对象
const config = require('../config');
const { getUserDataAsync,parseXMLAsync,formatMessage } = require('../utils/tool');
const rptemplate = require('./template');
const reply = require('./reply'); 


module.exports = () => {
    return async (req,res,next)=>{
        console.log(req.query);
        //微信服务器提交的参数
        // { sigmature:'sdsdfdsfddsff324324dsfdsfsdf',  微信的加密签名        
        // echostr:'32434324324324324234',              微信的随机字符串 
        // timestamp:'1234323',                         微信的发送请求时间戳
        // nonce:'113435343' }                          微信的随机数字
    
        const { signature, echostr,timestamp, nonce} = req.query;
        const { token }  = config;
        // 1. 将参与微信加密签名的三个参数(timestamp,nonce,token)按照字典排序并组合在一起形成一个数组       
        // 2. 将数组中所有参数拼接成一个字符串，进行sha1加密
        const sha1str = sha1([timestamp,nonce,token].sort().join(''));
        // console.log(sha1str,signature)
        // 3. 验证是否与微信服务器发送的加密签名一样

        if(req.method === 'GET'){
            if(sha1str === signature){
                // console.log('ok')
                res.send(echostr);
            }else{
                res.end('error');
            }
        }else if(req.method === 'POST'){
            if(sha1str !== signature){
                res.end('error');
            }
            // console.log(req.query);
            // { signature: '9325caeb96dfe8911a7dd4031848d7b06070d89e',
            //     timestamp: '1567654743',
            //     nonce: '1497008391',
            //     openid: 'ot15IuJaSUyzR3UAfLrS3nay_OOc'   用户的id}
            
            // 接收请求体的数据，流式数据
            const xmlData = await getUserDataAsync(req);
            // console.log(xmlData);
            // <xml><ToUserName><![CDATA[gh_5279dcb88ccc]]></ToUserName>  开发者id
            // <FromUserName><![CDATA[ot15IuJaSUyzR3UAfLrS3nay_OOc]]></FromUserName>    用户id
            // <CreateTime>1567656017</CreateTime>             时间戳
            // <MsgType><![CDATA[text]]></MsgType>             消息类型
            // <Content><![CDATA[56]]></Content>               内容
            // <MsgId>22443439808078186</MsgId>                消息id，微信默认保存3天，3天后销毁
            // </xml>

            // 解析xml数据
            const jsData = await parseXMLAsync (xmlData);
            // console.log(jsData)
            // { xml:
            //     { ToUserName: [ 'gh_5279dcb88ccc' ],
            //       FromUserName: [ 'ot15IuJaSUyzR3UAfLrS3nay_OOc' ],
            //       CreateTime: [ '1567663702' ],
            //       MsgType: [ 'text' ],
            //       Content: [ '全俄文全额' ],
            //       MsgId: [ '22443546540236184' ] } 
            // }

            // 格式化数据
            const message = formatMessage(jsData);
            // console.log(message);
            
            
            
            const options = reply(message);
            const replyMessage = rptemplate(options);
            console.log(replyMessage);

            // 返回数据给微信服务器
            res.send(replyMessage);
        }else{
            res.end('error');
        }
    }
}