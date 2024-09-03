# 最简单的方法使用文心智能体API调用



## 获取你的专属APi
前往创建你的专属AI https://agents.baidu.com/

1.创建智囊体 赋予AI的性格特征

2.创建成功后点击部署-API调用-复制API的ID，密钥，以及你智能体的ID

3.粘贴到源码里即可使用


## 在网页上使用自己创建的API

打开js，你需要修改以下内容：

        const appId = '***********';   //智能体API ID，通过你的智能体API页面获取
        const secretKey = '*****************';  //智能体API 密钥，通过你的智能API体页面获取
        const source = '****************';  //智能体 ID，通过你的智能体选项里的复制ID选项获取
        const from = '***************';
        const openId = '123'; //用户标识，可以自定义

        let MAX_CHATS =3;//限定每天的次数


注意：目前文心智囊体每天就500次的调用次数，

文心智能体官方文档：https://agents.baidu.com/docs/external-deploy/API_calls/


项目预览：https://fghdz.top/index.php/750.html

