class OptionsManager {
    constructor() {
        this.initializeElements();
        this.loadSettings();
        this.bindEvents();
    }

    initializeElements() {
        this.domainsList = document.getElementById('domains-list');
        this.addDomainBtn = document.getElementById('add-domain');
        this.llmProvider = document.getElementById('llm-provider');
        this.apiKey = document.getElementById('api-key');
        this.modelName = document.getElementById('model-name');
        this.customEndpoint = document.getElementById('custom-endpoint');
        this.customEndpointSection = document.getElementById('custom-endpoint-section');
        this.systemPrompt = document.getElementById('system-prompt');
        this.buttonPosition = document.getElementById('button-position');
        this.buttonColor = document.getElementById('button-color');
        this.saveBtn = document.getElementById('save-settings');
        this.status = document.getElementById('status');
    }

    bindEvents() {
        this.addDomainBtn.addEventListener('click', () => this.addDomainInput());
        this.llmProvider.addEventListener('change', () => this.toggleCustomEndpoint());
        this.saveBtn.addEventListener('click', () => this.saveSettings());
    }

    addDomainInput(value = '') {
        const domainItem = document.createElement('div');
        domainItem.className = 'domain-item';
        domainItem.innerHTML = `
            <input type="text" placeholder="example.com" value="${value}">
            <button type="button" class="remove-btn">Remove</button>
        `;
        
        domainItem.querySelector('.remove-btn').addEventListener('click', () => {
            domainItem.remove();
        });
        
        this.domainsList.appendChild(domainItem);
    }

    toggleCustomEndpoint() {
        const isCustom = this.llmProvider.value === 'custom';
        this.customEndpointSection.style.display = isCustom ? 'block' : 'none';
    }

    async loadSettings() {
        try {
            const settings = await chrome.storage.sync.get({
                domains: ['example.com'],
                llmProvider: 'openai',
                apiKey: '',
                modelName: 'gpt-3.5-turbo',
                customEndpoint: '',
                systemPrompt: 'You are a helpful AI assistant.',
                buttonPosition: 'bottom-right',
                buttonColor: '#4CAF50'
            });

            // Load domains
            this.domainsList.innerHTML = '';
            settings.domains.forEach(domain => this.addDomainInput(domain));

            // Load LLM settings
            this.llmProvider.value = settings.llmProvider;
            this.apiKey.value = settings.apiKey;
            this.modelName.value = settings.modelName;
            this.customEndpoint.value = settings.customEndpoint;
            this.systemPrompt.value = settings.systemPrompt;

            // Load appearance settings
            this.buttonPosition.value = settings.buttonPosition;
            this.buttonColor.value = settings.buttonColor;

            this.toggleCustomEndpoint();
        } catch (error) {
            this.showStatus('Error loading settings: ' + error.message, 'error');
        }
    }

    async saveSettings() {
        try {
            const domainInputs = this.domainsList.querySelectorAll('input');
            const domains = Array.from(domainInputs)
                .map(input => input.value.trim())
                .filter(domain => domain.length > 0);

            if (domains.length === 0) {
                this.showStatus('Please add at least one domain.', 'error');
                return;
            }

            if (!this.apiKey.value.trim()) {
                this.showStatus('Please enter an API key.', 'error');
                return;
            }

            const settings = {
                domains,
                llmProvider: this.llmProvider.value,
                apiKey: this.apiKey.value.trim(),
                modelName: this.modelName.value.trim() || 'gpt-3.5-turbo',
                customEndpoint: this.customEndpoint.value.trim(),
                systemPrompt: this.systemPrompt.value.trim() || 'You are a helpful AI assistant.',
                buttonPosition: this.buttonPosition.value,
                buttonColor: this.buttonColor.value
            };

            await chrome.storage.sync.set(settings);
            this.showStatus('Settings saved successfully!', 'success');
        } catch (error) {
            this.showStatus('Error saving settings: ' + error.message, 'error');
        }
    }

    showStatus(message, type) {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        this.status.style.display = 'block';
        
        setTimeout(() => {
            this.status.style.display = 'none';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OptionsManager();
});