        const appId = '2oaCahtOHCWy2wsE1VAgcglMsLN6Rs07';   //智能体API ID，通过你的智能体API页面获取
        const secretKey = 'RaDDc3qVIl49GtrvCxTY1qA8PdJ3TjfX';  //智能体API 密钥，通过你的智能API体页面获取
        const source = '2oaCahtOHCWy2wsE1VAgcglMsLN6Rs07';  //智能体 ID，通过你的智能体选项里的复制ID选项获取
        const from = 'openapi';
        const openId = '123'; //用户标识，可以自定义

        let MAX_CHATS =3;//限定每天的次数
        const RESET_TIME = 24 * 60 * 60 * 1000; // 24 hours

        function initializeChatCount() {
            const lastReset = localStorage.getItem('lastReset');
            const currentTime = new Date().getTime();

            if (!lastReset || currentTime - lastReset > RESET_TIME) {
                localStorage.setItem('chatCount', MAX_CHATS);
                localStorage.setItem('lastReset', currentTime);
            }

            updateRemainingPercentage();
        }

        function updateRemainingPercentage() {
            const chatCount = localStorage.getItem('chatCount') || MAX_CHATS;
            const percentage = Math.floor((chatCount / MAX_CHATS) * 100);
            document.getElementById('percentage').textContent = percentage + '%';
        }

        function decrementChatCount() {
            let chatCount = localStorage.getItem('chatCount');
            if (chatCount > 0) {
                chatCount--;
                localStorage.setItem('chatCount', chatCount);
            }
            return chatCount;
        }

        function resetChatCount() {
            localStorage.setItem('chatCount', MAX_CHATS);
            localStorage.setItem('lastReset', new Date().getTime());
            updateRemainingPercentage();
        }

        function sendMessage() {
            let chatCount = localStorage.getItem('chatCount');
            if (chatCount <= 0) {
                displayAIMessage('【自动回复】 老师已经对你失去了耐心，你的愚蠢的问题不值得回答，你应该珍惜我的时间，记住，智慧是需要自己去追求和探索的，而不是通过无休止的询问来获取的，明天再来问我吧！');//调取失败的回复
                return;
            }

            const userInput = document.getElementById('user-input').value;
            if (!userInput.trim()) {
                alert('Please enter a message.');
                return;
            }

            // Display the user's message
            displayUserMessage(userInput);

            // Show the AI thinking message
            const thinkingMessageElement = displayAIMessage('老师正在输入中...');

            const url = `https://agentapi.baidu.com/assistant/getAnswer?appId=${appId}&secretKey=${secretKey}`;

            const data = {
                message: {
                    content: {
                        type: "text",
                        value: {
                            showText: userInput
                        }
                    }
                },
                source: source,
                from: from,
                openId: openId
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 0 && data.message === 'succ') {
                    // Replace the thinking message with the AI's response
                    thinkingMessageElement.textContent = data.data.content[0].data;
                    console.log('API Response:', data); // Log the entire API response
                } else {
                    thinkingMessageElement.textContent = '【自动回复】我要求你立刻调整你的态度，找到问题的核心，并用最清晰最直接的方式表达出来，现在请你重新组织自己的语言重新提问';//调取失败的回复
                }
            })
            .catch(error => {
                console.error('Error:', error);
                thinkingMessageElement.textContent = '【自动回复】我没空跟你解释你这个白痴问题，你等我有空了再跟你解答这个傻瓜问题';//调取失败的回复
            });

            // Clear the input box
            document.getElementById('user-input').value = '';

            // Decrement chat count and update UI
            decrementChatCount();
            updateRemainingPercentage();
        }

        function displayUserMessage(message) {
            const chatContainer = document.getElementById('chat-container');
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messageElement.className = 'message user-message';
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the latest message
        }

        function displayAIMessage(message) {
            const chatContainer = document.getElementById('chat-container');
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messageElement.className = 'message ai-message';
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the latest message
            return messageElement;
        }

        // Listen for the "重置" command in console
        (function() {
            const originalLog = console.log;
            console.log = function(...args) {
                if (args[0] === '重置') {
                    resetChatCount();
                    alert('Chat count reset!');
                }
                originalLog.apply(console, args);
            }
        })();

        // Initialize chat count on load
        initializeChatCount();

        // Optional: Display some initial info
        displayAIMessage("我是维里塔斯·拉帝奥，博识学会的学者和老师，也是一介庸人。如果有一天，你的脑袋出现了「愚钝」的症状，届时请称呼我为——「真理医生」");//开场白