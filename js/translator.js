class SimpleTranslator {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        // Load saved language preference
        const savedLang = localStorage.getItem('portfolio-lang') || 'en';
        await this.setLanguage(savedLang);
        
        // Add click events to language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    async setLanguage(lang) {
        try {
            // Load translation file if not already loaded
            if (!this.translations[lang]) {
                const response = await fetch(`translations/${lang}.json`);
                if (!response.ok) throw new Error('Translation file not found');
                this.translations[lang] = await response.json();
            }
            
            this.currentLang = lang;
            this.updateContent();
            this.updateActiveButton(lang);
            
            // Save preference
            localStorage.setItem('portfolio-lang', lang);
            
            console.log(`Language changed to: ${lang}`);
        } catch (error) {
            console.error('Error changing language:', error);
            // Fallback to English
            if (lang !== 'en') {
                await this.setLanguage('en');
            }
        }
    }

    updateContent() {
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });
    }

    updateActiveButton(lang) {
        // Update active state of language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active', 'bg-cyan-600', 'text-white', 'border-cyan-400');
                btn.classList.remove('bg-transparent', 'text-gray-400', 'border-gray-500');
            } else {
                btn.classList.remove('active', 'bg-cyan-600', 'text-white', 'border-cyan-400');
                btn.classList.add('bg-transparent', 'text-gray-400', 'border-gray-500');
            }
        });
    }
}

// Initialize translator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioTranslator = new SimpleTranslator();
});