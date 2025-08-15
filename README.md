# AI Chatbot Chrome Extension

A Chrome extension that adds an AI-powered chatbot to any website you configure. The chatbot supports multiple LLM providers including OpenAI, Anthropic, Google, and custom APIs.

## Features

- 🌐 **Domain Configuration**: Configure specific domains where the chatbot should appear
- 🤖 **Multiple LLM Support**: Works with OpenAI (GPT), Anthropic (Claude), Google (Gemini), and custom APIs
- 💬 **Floating Chat Interface**: Clean, modern chat dialog that doesn't interfere with the website
- ⚙️ **Customizable**: Configure button position, colors, and system prompts
- 🔒 **Privacy Focused**: All settings stored locally in your browser

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your extensions list

### Method 2: Create Icons (Optional)

The extension expects icon files in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels) 
- `icon128.png` (128x128 pixels)

You can create simple chat bubble icons or use any 16x16, 48x48, and 128x128 pixel PNG images.

## Configuration

1. **Open Settings**: Click the extension icon and select "Open Settings"

2. **Configure Domains**: Add the domains where you want the chatbot to appear
   - Example: `example.com`, `github.com`, `stackoverflow.com`
   - The chatbot will appear on these domains and their subdomains

3. **Choose LLM Provider**: Select your preferred AI provider:
   - **OpenAI**: Requires OpenAI API key, supports GPT models
   - **Anthropic**: Requires Anthropic API key, supports Claude models  
   - **Google**: Requires Google AI API key, supports Gemini models
   - **Custom**: For other OpenAI-compatible APIs

4. **Enter API Key**: Get your API key from your chosen provider:
   - OpenAI: https://platform.openai.com/api-keys
   - Anthropic: https://console.anthropic.com/
   - Google: https://aistudio.google.com/app/apikey

5. **Customize Appearance**: 
   - Choose button position (bottom-right, bottom-left, etc.)
   - Select button color
   - Customize system prompt

## Usage

1. Visit any website you've configured in the allowed domains
2. Look for the floating chat button (usually in the bottom-right corner)
3. Click the button to open the chat dialog
4. Type your message and press Enter or click Send
5. The AI will respond based on your configured provider and model

## API Provider Setup

### OpenAI
- Model examples: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`
- Get API key: https://platform.openai.com/api-keys

### Anthropic (Claude)
- Model examples: `claude-3-haiku-20240307`, `claude-3-sonnet-20240229`, `claude-3-opus-20240229`
- Get API key: https://console.anthropic.com/

### Google (Gemini)
- Model examples: `gemini-pro`, `gemini-pro-vision`
- Get API key: https://aistudio.google.com/app/apikey

### Custom API
- Use any OpenAI-compatible API endpoint
- Provide the full endpoint URL (e.g., `https://api.example.com/v1/chat/completions`)

## Troubleshooting

### Chatbot doesn't appear
- Check that the current domain is in your allowed domains list
- Make sure the extension is enabled
- Refresh the page after changing settings

### API errors
- Verify your API key is correct
- Check that you have sufficient credits/quota with your provider
- Ensure the model name is spelled correctly

### Button positioning issues
- Try different position settings in the appearance section
- Some websites may have conflicting CSS - the extension tries to override these

## Privacy & Security

- All configuration is stored locally in your browser
- API keys are stored securely in Chrome's extension storage
- No data is sent to servers other than your chosen AI provider
- Conversations are not logged or stored by the extension

## Development

The extension consists of:
- `manifest.json` - Extension configuration
- `content.js` - Injects chatbot into web pages
- `background.js` - Handles API calls to LLM providers
- `options.html/js` - Settings page
- `popup.html/js` - Extension popup
- `styles.css` - Chatbot styling

## Contributing

Feel free to submit issues and pull requests to improve the extension.

## License

MIT License - see LICENSE file for details