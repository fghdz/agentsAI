## 使用文心智能体API调用
在网页上使用自己创建的API

你需要修改的地方：

        const appId = '***********';   //智能体API ID，通过你的智能体API页面获取
        const secretKey = '*****************';  //智能体API 密钥，通过你的智能API体页面获取
        const source = '****************';  //智能体 ID，通过你的智能体选项里的复制ID选项获取
        const from = '***************';
        const openId = '123'; //用户标识，可以自定义

        let MAX_CHATS =3;//限定每天的次数


注意：目前文心智囊体每天就500次的调用次数，

文心智能体官方文档：https://agents.baidu.com/docs/external-deploy/API_calls/

