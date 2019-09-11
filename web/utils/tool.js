/*工具函数包 */
const { parseString } = require('xml2js')

module.exports = {
    getUserDataAsync(req){
        return new Promise((resolve,reject)=>{
            let xmlData = '';
            req
            .on('data',data=>{
                // 当流式数据传来，触发事件，将数据注入到回调函数中
                // console.log(data);
                // 数据是buffer，需要转换成字符串
                xmlData += data.toString();
            })
            .on('end',()=>{
                // 数据接收完毕触发
                resolve(xmlData);
            })
        })
    }
    ,
    parseXMLAsync(xmlData){
        return new Promise((resolve,reject)=>{
            parseString(xmlData,{trim:true},(err,data)=>{
                if(!err){
                    resolve(data);
                }else{
                    reject('parseXMLAsync 报错:'+err)
                }
            })
        })  
    },
    formatMessage(jsData){
        let message = {};
        jsData = jsData.xml;
        // console.log(jsData);
        if(typeof jsData === 'object'){
            //遍历对象
            for(let key in jsData){
                let value = jsData[key];
                // console.log(key,value[0]);
                if(Array.isArray(value) && value[0]){
                    message[key] = value[0]
                }
            }
            // console.log(message);
            return message;
        }
    }
}