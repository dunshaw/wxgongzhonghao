
/* 处理用户发送消息的内容和类型，决定返回用户的消息内容体制*/  
module.exports = () =>{
    
    let options = {
        ToUserName: message.FromUserName,
        FromUserName:message.ToUserName,
        CreateTime:Date.now(),
        MsgType:'text'
    }


    // 回复文本消息
    let content = '您发送的信息无法识别.';
    if(message.MsgType === 'text'){
        if(message.Content === '1'){
            content = '大吉大利，今晚吃鸡！'
        }else if(message.Content === '2'){
            content = '落地成盒!'
        }else if(message.Content.match('爱')){       //半匹配
            content = 'I LOVE U !'
        }
    }else if(message.MsgType === 'image'){
        // 用户发送图片消息
        options.msgType = 'image';
        options.mediaId = message.MediaId;
        console.log(message.PicUrl);
    }else if(message.MsgType === 'voice'){
        options.msgType = 'voice';
        options.mediaId = message.MediaId;
        console.log(message.Recognition);           //开启语音识别
    }else if(message.MsgType === 'location'){
        content = `纬度：${message.Location_X} 经度：${message.Location_Y} 缩放大小：${message.Scale} 位置信息：${message.Label}`
    }else if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            // 用户订阅
            content = '欢迎您的关注~';
            
        }else if(message.Event === 'unsubscribe'){
            // 用户取消订阅
            console.log('用户取消订阅');
        }else if(message.Event === 'SCAN'){
            content = '用户已经关注过，再扫描带参数的二维码关注事件'
        }
    }

    options.content = content;
    return options;
}