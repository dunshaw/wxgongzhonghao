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
                - 发送请求获取token并保存使用 (saveAccessToken)
                         
*/