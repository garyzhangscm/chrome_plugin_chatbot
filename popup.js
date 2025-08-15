class PopupManager {
    constructor() {
        this.initializeElements();
        this.checkStatus();
        this.bindEvents();
    }

    initializeElements() {
        this.statusDiv = document.getElementById('status');
        this.statusText = document.getElementById('status-text');
        this.openSettingsBtn = document.getElementById('open-settings');
        this.testCurrentSiteBtn = document.getElementById('test-current-site');
    }

    bindEvents() {
        this.openSettingsBtn.addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });

        this.testCurrentSiteBtn.addEventListener('click', async () => {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.checkSiteCompatibility(tab.url);
        });
    }

    async checkStatus() {
        try {
            const settings = await chrome.storage.sync.get({
                domains: [],
                apiKey: ''
            });

            const hasApiKey = settings.apiKey && settings.apiKey.trim().length > 0;
            const hasDomains = settings.domains && settings.domains.length > 0;

            if (hasApiKey && hasDomains) {
                this.updateStatus('Chatbot configured and ready', 'active');
                await this.checkCurrentSite();
            } else {
                let message = 'Configuration needed: ';
                const missing = [];
                if (!hasApiKey) missing.push('API key');
                if (!hasDomains) missing.push('domains');
                message += missing.join(' and ');
                
                this.updateStatus(message, 'inactive');
            }
        } catch (error) {
            this.updateStatus('Error loading configuration', 'inactive');
            console.error('Error checking status:', error);
        }
    }

    async checkCurrentSite() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.url) {
                const settings = await chrome.storage.sync.get({ domains: [] });
                const currentDomain = new URL(tab.url).hostname;
                
                const isSupported = settings.domains.some(domain => 
                    currentDomain === domain || currentDomain.endsWith('.' + domain)
                );

                if (isSupported) {
                    this.updateStatus(`Active on ${currentDomain}`, 'active');
                } else {
                    this.updateStatus(`Not configured for ${currentDomain}`, 'inactive');
                }
            }
        } catch (error) {
            console.error('Error checking current site:', error);
        }
    }

    async checkSiteCompatibility(url) {
        try {
            const domain = new URL(url).hostname;
            const settings = await chrome.storage.sync.get({ domains: [] });
            
            const isSupported = settings.domains.some(configuredDomain => 
                domain === configuredDomain || domain.endsWith('.' + configuredDomain)
            );

            if (isSupported) {
                this.updateStatus(`✓ Chatbot will appear on ${domain}`, 'active');
            } else {
                this.updateStatus(`✗ Add ${domain} to allowed domains in settings`, 'inactive');
            }
        } catch (error) {
            this.updateStatus('Invalid URL', 'inactive');
        }
    }

    updateStatus(text, type) {
        this.statusText.textContent = text;
        this.statusDiv.className = `status ${type}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});