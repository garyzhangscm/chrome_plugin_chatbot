class LLMApiHandler {
    constructor() {
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'callLLM') {
                this.handleLLMRequest(request.messages, request.settings)
                    .then(response => sendResponse(response))
                    .catch(error => sendResponse({ error: error.message }));
                return true; // Indicates we will send a response asynchronously
            }
        });
    }

    async handleLLMRequest(messages, settings) {
        try {
            switch (settings.llmProvider) {
                case 'openai':
                    return await this.callOpenAI(messages, settings);
                case 'anthropic':
                    return await this.callAnthropic(messages, settings);
                case 'google':
                    return await this.callGoogle(messages, settings);
                case 'custom':
                    return await this.callCustomAPI(messages, settings);
                default:
                    throw new Error('Unsupported LLM provider');
            }
        } catch (error) {
            console.error('LLM API Error:', error);
            throw error;
        }
    }

    async callOpenAI(messages, settings) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.modelName || 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return { content: data.choices[0].message.content };
    }

    async callAnthropic(messages, settings) {
        // Convert messages format for Anthropic
        const systemMessage = messages.find(m => m.role === 'system');
        const conversationMessages = messages.filter(m => m.role !== 'system');

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': settings.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: settings.modelName || 'claude-3-haiku-20240307',
                max_tokens: 1000,
                system: systemMessage?.content || 'You are a helpful AI assistant.',
                messages: conversationMessages
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return { content: data.content[0].text };
    }

    async callGoogle(messages, settings) {
        // Convert messages to Google's format
        const contents = messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

        const systemInstruction = messages.find(m => m.role === 'system')?.content;

        const requestBody = {
            contents: contents,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7
            }
        };

        if (systemInstruction) {
            requestBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const modelName = settings.modelName || 'gemini-pro';
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${settings.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Google API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Google API');
        }

        return { content: data.candidates[0].content.parts[0].text };
    }

    async callCustomAPI(messages, settings) {
        if (!settings.customEndpoint) {
            throw new Error('Custom endpoint not configured');
        }

        const response = await fetch(settings.customEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
                model: settings.modelName,
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Custom API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        // Try to extract content from common response formats
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return { content: data.choices[0].message.content };
        } else if (data.content) {
            return { content: data.content };
        } else if (data.response) {
            return { content: data.response };
        } else {
            throw new Error('Unable to parse response from custom API');
        }
    }
}

// Initialize the LLM API handler
new LLMApiHandler();