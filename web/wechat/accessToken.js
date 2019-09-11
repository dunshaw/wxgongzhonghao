/*获取微信调用的唯一凭据
    特点：
    1. 唯一的
    2. 有效期2小时，提前5分钟左右请求token
    3. 接口权限 每天2000次

    https请求方式: GET
    https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

    结构：
        读取本地文件(readAccessToken)
            - 本地有文件
                - 判断是否过期(isValidAccessToken)
                    - 过期          e：重新请求获取accesstoken，保存覆盖之前的文件，保证文件的唯一性(saveAccessToken)
                    - 没过期        e：直接使用
            - 本地无文件
                - 发送请求获取token(getAccessToken),并保存使用 (saveAccessToken)
                         
*/
// 引入模块
const $rq = require('request-promise-native');
const {writeFile,readFile} = require('fs');
const {appID,appsecret} = require('../config');

// 定义类，获取accessToken
class Wechat{
    constructor(){

    }
    // 获取
    getAccessToken (){
        // 定义请求的地址
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
        // 发送请求 request
        return new Promise((resolve,reject)=>{
            $rq({method:'GET',url,json:true})
            .then(res =>{
                console.log(res);
                /* {access_token:'2132432sfs3fdsf32trf32f3',
                    expires_in:7200 } */
                res.expires_in = Date.now() + (res.expires_in-300)*1000;
                resolve(res);
            })
            .catch(err => {
                console.log(err)
                reject('获取token报错'+err)
            })
        })
        
    }

    // 保存
    saveAccessToken (accessToken){
        // 将对象转化成json字符才能保存
        accessToken = JSON.stringify(accessToken);
        // 异步的方法(writeFile)需要保证一定要保存
        return new Promise((resolve,reject)=>{
            writeFile('./accessToken.txt',accessToken,err=>{
                if(!err){
                    console.log('ok');
                    resolve()
                }else{
                    reject('保存文件出错,'+err)
                }
            })
        })
        
    }

    // 读取
    readAccessToken (){
        return new Promise((resolve,rejext)=>{
            readFile('./accsessToken.txt',(err,data)=> {
                if(!err){
                    // 将json转化成js对象
                    data = JSON.parse(data);
                    resolve(data);
                }else{
                    reject('读取失败:'+err);
                }
            })
        })
    }

    // 判断有效
    isValidAccessToken(data){
        // 检查参数是否有效值
        if(!data && !data.access_token && !data.expires_in){
            return false;
        }
        //  检查是否过期
        return data.expires_in > Date.now();
    }

    // 返回没有过期accesstoken
    fetchAccessToken() {
        if(this.access_token && this.expires_in && this.isValidAccessToken(this)){
            return Promise.resolve({
                access_token:this.access_token,
                expires_in:this.expires_in
            })
        }
        return this.readAccessToken()
            .then(async res=>{
                if(this.isValidAccessToken(res)) {
                    // resolve(res);
                    return Promise.resolve(res);
                }else{
                    const res = await this.getAccessToken();
                    await this.saveAccessToken(res);
                    return Promise.resolve(res);
                }
            })
            .catch(async err=>{
                const res = await this.getAccessToken();
                await this.saveAccessToken(res);
                return Promise.resolve(res);
            })
            .then(res =>{
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                return Promise.resolve(res);
            })
    }
}


// const w = new Wechat()
// w.readAccessToken()
// .then(res=>{
//     console.log(res)
// })
// .catch(err=>{
//     console.log(err)
// })