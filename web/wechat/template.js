/* 加工回复用户的模板 xml数据*/

module.exports = options =>{
    // 定义模板基础信息
    let replyMessage = `
    <xml>
    <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${message.FromUserName}]]></FromUserName>
    <CreateTime>${options.createTime}</CreateTime>
    <MsgType><![CDATA[${options.msgType}]]></MsgType>`;

    // 根据回复的消息类型，设定不同的内容
    if(options.msgType === 'text'){   // 文本
        replyMessage += `<Content><![CDATA[${options.content}]]></Content>`;
    }else if(options.msgType === 'image'){   // 图片
        replyMessage += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
    }else if(options.msgType === 'voice'){   // 语音
        replyMessage += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
    }else if(options.msgType === 'video'){   // 视频
        replyMessage += `<Video><MediaId><![CDATA[${options.mediaId}]]></MediaId>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description></Video>`
    }else if(options.msgType === 'music'){   // 音乐
        replyMessage += `<Music><Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
        <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId></Music>`
    }else if(options.msgType === 'news'){   // 图文
        replyMessage += `
        <ArticleCount>${options.content.length}</ArticleCount>
        <Articles>`
        options.content.forEach(item =>{
            replyMessage += 
            `<item>
                <Title><![CDATA[${item.title}]]></Title>
                <Description><![CDATA[${item.description}]]></Description>
                <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
                <Url><![CDATA[${item.url}]]></Url>
            </item>`
        })
          
        replyMessage += `</Articles>`;
    }

    replyMessage += '</xml>';
    // 最终回复的xml
    return replyMessage;
    
}