        const appId = '***********';   //智能体API ID，通过你的智能体API页面获取
        const secretKey = '*****************';  //智能体API 密钥，通过你的智能API体页面获取
        const source = '****************';  //智能体 ID，通过你的智能体选项里的复制ID选项获取
        const from = '***************';
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
                displayAIMessage('未知错误，请尝试');//调取失败的回复
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
            const thinkingMessageElement = displayAIMessage('AI思考中...');

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
                    thinkingMessageElement.textContent = '未知错误，请尝试';//调取失败的回复
                }
            })
            .catch(error => {
                console.error('Error:', error);
                thinkingMessageElement.textContent = '未知错误，请尝试';//调取失败的回复
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
        displayAIMessage("你好，请问有什么可以帮助你");//开场白
