class ChatbotInjector {
    constructor() {
        this.settings = null;
        this.chatDialog = null;
        this.chatButton = null;
        this.isDialogOpen = false;
        this.messageHistory = [];
        this.init();
    }

    async init() {
        await this.loadSettings();
        if (this.shouldInjectChatbot()) {
            this.injectChatbot();
        }
    }

    async loadSettings() {
        try {
            this.settings = await chrome.storage.sync.get({
                domains: ['example.com'],
                llmProvider: 'openai',
                apiKey: '',
                modelName: 'gpt-3.5-turbo',
                customEndpoint: '',
                systemPrompt: 'You are a helpful AI assistant.',
                buttonPosition: 'bottom-right',
                buttonColor: '#4CAF50'
            });
        } catch (error) {
            console.error('Failed to load chatbot settings:', error);
        }
    }

    shouldInjectChatbot() {
        if (!this.settings || !this.settings.domains) return false;
        
        const currentDomain = window.location.hostname;
        return this.settings.domains.some(domain => 
            currentDomain === domain || currentDomain.endsWith('.' + domain)
        );
    }

    injectChatbot() {
        this.createChatButton();
        this.createChatDialog();
    }

    createChatButton() {
        this.chatButton = document.createElement('div');
        this.chatButton.id = 'ai-chatbot-button';
        this.chatButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
                <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="white"/>
            </svg>
        `;
        
        this.chatButton.style.cssText = `
            position: fixed;
            width: 60px;
            height: 60px;
            background-color: ${this.settings.buttonColor};
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            border: none;
        `;

        this.setButtonPosition();

        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.chatButton.addEventListener('mouseenter', () => {
            this.chatButton.style.transform = 'scale(1.1)';
        });
        this.chatButton.addEventListener('mouseleave', () => {
            this.chatButton.style.transform = 'scale(1)';
        });

        document.body.appendChild(this.chatButton);
    }

    setButtonPosition() {
        const position = this.settings.buttonPosition || 'bottom-right';
        switch (position) {
            case 'bottom-right':
                this.chatButton.style.bottom = '20px';
                this.chatButton.style.right = '20px';
                break;
            case 'bottom-left':
                this.chatButton.style.bottom = '20px';
                this.chatButton.style.left = '20px';
                break;
            case 'top-right':
                this.chatButton.style.top = '20px';
                this.chatButton.style.right = '20px';
                break;
            case 'top-left':
                this.chatButton.style.top = '20px';
                this.chatButton.style.left = '20px';
                break;
        }
    }

    createChatDialog() {
        this.chatDialog = document.createElement('div');
        this.chatDialog.id = 'ai-chatbot-dialog';
        this.chatDialog.innerHTML = `
            <div class="chatbot-header">
                <h3>AI Assistant</h3>
                <button class="close-btn" type="button">&times;</button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="welcome-message">
                    <div class="message bot">
                        <div class="message-content">Hi! I'm your AI assistant. How can I help you today?</div>
                    </div>
                </div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Type your message..." autocomplete="off" />
                <button id="chatbot-send" type="button">Send</button>
            </div>
        `;

        // Apply comprehensive styling to ensure visibility
        this.chatDialog.style.cssText = `
            all: initial !important;
            position: fixed !important;
            bottom: 90px !important;
            right: 20px !important;
            width: 350px !important;
            height: 400px !important;
            background: white !important;
            border: 1px solid #ddd !important;
            border-radius: 10px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
            z-index: 2147483647 !important;
            display: none !important;
            flex-direction: column !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            overflow: hidden !important;
            max-width: calc(100vw - 40px) !important;
            max-height: calc(100vh - 120px) !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            clip: auto !important;
            clip-path: none !important;
        `;

        this.setDialogPosition();
        this.setupDialogEvents();
        document.body.appendChild(this.chatDialog);
        
        // Add debugging
        console.log('Chatbot dialog created and appended to body');
    }

    setDialogPosition() {
        const position = this.settings.buttonPosition || 'bottom-right';
        switch (position) {
            case 'bottom-right':
                this.chatDialog.style.bottom = '90px !important';
                this.chatDialog.style.right = '20px !important';
                this.chatDialog.style.left = 'auto !important';
                this.chatDialog.style.top = 'auto !important';
                break;
            case 'bottom-left':
                this.chatDialog.style.bottom = '90px !important';
                this.chatDialog.style.left = '20px !important';
                this.chatDialog.style.right = 'auto !important';
                this.chatDialog.style.top = 'auto !important';
                break;
            case 'top-right':
                this.chatDialog.style.top = '90px !important';
                this.chatDialog.style.right = '20px !important';
                this.chatDialog.style.left = 'auto !important';
                this.chatDialog.style.bottom = 'auto !important';
                break;
            case 'top-left':
                this.chatDialog.style.top = '90px !important';
                this.chatDialog.style.left = '20px !important';
                this.chatDialog.style.right = 'auto !important';
                this.chatDialog.style.bottom = 'auto !important';
                break;
        }
    }

    setupDialogEvents() {
        const closeBtn = this.chatDialog.querySelector('.close-btn');
        const sendBtn = this.chatDialog.querySelector('#chatbot-send');
        const input = this.chatDialog.querySelector('#chatbot-input');

        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isDialogOpen = !this.isDialogOpen;
        
        if (this.isDialogOpen) {
            // Force the dialog to be visible with multiple CSS approaches
            this.chatDialog.style.setProperty('display', 'flex', 'important');
            this.chatDialog.style.setProperty('visibility', 'visible', 'important');
            this.chatDialog.style.setProperty('opacity', '1', 'important');
            this.chatDialog.style.setProperty('pointer-events', 'auto', 'important');
            
            // Focus the input after a short delay to ensure it's rendered
            setTimeout(() => {
                const input = this.chatDialog.querySelector('#chatbot-input');
                if (input) {
                    input.focus();
                }
            }, 100);
        } else {
            this.chatDialog.style.setProperty('display', 'none', 'important');
        }
    }

    async sendMessage() {
        const input = this.chatDialog.querySelector('#chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        this.addMessage('Thinking...', 'bot', true);

        try {
            const response = await this.callLLM(message);
            this.removeTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            console.error('LLM API Error:', error);
        }
    }

    addMessage(text, sender, isTyping = false) {
        const messagesContainer = this.chatDialog.querySelector('#chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}${isTyping ? ' typing' : ''}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (!isTyping) {
            this.messageHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content: text });
        }
    }

    removeTypingIndicator() {
        const typingIndicator = this.chatDialog.querySelector('.message.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async callLLM(message) {
        const messages = [
            { role: 'system', content: this.settings.systemPrompt },
            ...this.messageHistory,
            { role: 'user', content: message }
        ];

        const response = await chrome.runtime.sendMessage({
            action: 'callLLM',
            messages: messages,
            settings: this.settings
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.content;
    }
}

// Initialize the chatbot when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ChatbotInjector());
} else {
    new ChatbotInjector();
}