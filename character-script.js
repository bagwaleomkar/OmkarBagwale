/**
 * Section Character Guide Script
 * Manages cartoon characters in each section with contextual messages
 */

class SectionCharacterGuide {
    constructor() {
        this.characters = new Map();
        this.activeCharacter = null;
        this.isAnimating = false;
        
        // placeholders - will be loaded from JSON
        this.messages = {};
        this.config = null;

        // start async initialization that loads JSON
        this.loadConfigAndMessages().then(() => {
            this.init();
        }).catch(err => {
            console.error('Failed to load character config/messages:', err);
            // fallback to defaults so feature still works
            this.messages = {
                home: "Hi! Welcome to my portfolio! 👋",
                about: "Let me tell you about myself! 🧑‍💻",
                skills: "Check out my awesome skills! 💪",
                projects: "Here are my cool projects! 🚀",
                contact: "Let's get in touch! 📧"
            };
            this.config = null;
            this.init();
        });
    }
    
    init() {
        this.createCharactersForSections();
        this.applyPositions();
        this.setupIntersectionObserver();
        this.setupEventListeners();

        // Update positions on resize (debounced)
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.applyPositions(), 120);
        });
    }

    async loadConfigAndMessages() {
        // Attempt to fetch JSON files from project root
        const messagesUrl = 'character-messages.json';
        const configUrl = 'character-config.json';

        const [msgResp, cfgResp] = await Promise.all([
            fetch(messagesUrl),
            fetch(configUrl)
        ]);

        if (!msgResp.ok) throw new Error('Could not load ' + messagesUrl);
        if (!cfgResp.ok) throw new Error('Could not load ' + configUrl);

        this.messages = await msgResp.json();
        this.config = await cfgResp.json();
    }
    
    createCharactersForSections() {
        const sections = ['home', 'about', 'skills', 'projects', 'contact'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                // Create character container
                const characterDiv = document.createElement('div');
                characterDiv.className = `section-character ${sectionId}-character`;
                characterDiv.id = `${sectionId}-character`;
                
                // Create character image
                const img = document.createElement('img');
                img.className = 'character-image';
                img.src = 'assets/omkar.jpeg';
                img.alt = 'Guide Character';
                img.onerror = () => {
                    img.style.display = 'none';
                    const fallback = characterDiv.querySelector('.character-fallback');
                    if (fallback) fallback.style.display = 'flex';
                };
                
                // Create fallback
                const fallback = document.createElement('div');
                fallback.className = 'character-fallback';
                fallback.textContent = '🧑‍💻';
                
                // Create speech bubble
                const bubble = document.createElement('div');
                bubble.className = 'section-speech-bubble';
                bubble.id = `${sectionId}-bubble`;
                
                const bubbleText = document.createElement('span');
                bubbleText.className = 'bubble-text';
                bubbleText.textContent = this.messages[sectionId];
                
                const arrow = document.createElement('div');
                arrow.className = 'bubble-arrow';
                
                bubble.appendChild(bubbleText);
                bubble.appendChild(arrow);
                
                characterDiv.appendChild(img);
                characterDiv.appendChild(fallback);
                characterDiv.appendChild(bubble);
                
                // Add to section
                section.style.position = 'relative'; // Ensure relative positioning
                section.appendChild(characterDiv);
                
                // Store reference
                this.characters.set(sectionId, {
                    container: characterDiv,
                    bubble: bubble,
                    text: bubbleText,
                    image: img
                });
            }
        });
    }

    applyPositions() {
        // Apply top offsets from config (desktop/mobile) if available
        const isMobile = window.innerWidth <= 768;
        const defaultOffset = (this.config && this.config.defaultOffset) || { desktopTop: 80, mobileTop: 60 };

        this.characters.forEach((character, sectionId) => {
            let topPx = null;
            if (this.config && this.config.sections && this.config.sections[sectionId]) {
                const sec = this.config.sections[sectionId];
                topPx = isMobile ? (sec.mobileTop ?? defaultOffset.mobileTop) : (sec.desktopTop ?? defaultOffset.desktopTop);
            } else {
                topPx = isMobile ? defaultOffset.mobileTop : defaultOffset.desktopTop;
            }

            // Apply as inline style to override CSS
            character.container.style.top = `${topPx}px`;
        });
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '-50px 0px -50px 0px'
        };
        
        const callback = (entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                const character = this.characters.get(sectionId);
                
                if (character) {
                    if (entry.isIntersecting) {
                        // Show character when section is visible
                        character.container.classList.add('visible');
                        
                        // Show welcome bubble after a delay
                        setTimeout(() => {
                            this.showBubble(sectionId);
                        }, 1000);
                        
                        // Set as active character
                        if (this.activeCharacter !== sectionId) {
                            this.setActiveCharacter(sectionId);
                        }
                    } else {
                        // Hide character when section is not visible
                        character.container.classList.remove('visible');
                        this.hideBubble(sectionId);
                    }
                }
            });
        };
        
        const observer = new IntersectionObserver(callback, options);
        
        // Observe all sections
        this.characters.forEach((character, sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) observer.observe(section);
        });
    }
    
    setupEventListeners() {
        // Add event listeners to each character
        this.characters.forEach((character, sectionId) => {
            // Show bubble on hover
            character.container.addEventListener('mouseenter', () => {
                this.showBubble(sectionId);
            });
            
            // Show bubble on click
            character.container.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBubble(sectionId);
            });
        });
        
        // Hide bubbles when clicking outside
        document.addEventListener('click', (e) => {
            this.characters.forEach((character, sectionId) => {
                if (!character.container.contains(e.target)) {
                    this.hideBubble(sectionId);
                }
            });
        });
    }
    
    setActiveCharacter(sectionId) {
        // Remove active class from previous character
        if (this.activeCharacter) {
            const prevCharacter = this.characters.get(this.activeCharacter);
            if (prevCharacter) {
                prevCharacter.container.classList.remove('active');
            }
        }
        
        // Set new active character
        this.activeCharacter = sectionId;
        const character = this.characters.get(sectionId);
        if (character) {
            character.container.classList.add('active');
        }
    }
    
    showBubble(sectionId) {
        const character = this.characters.get(sectionId);
        if (character && !this.isAnimating) {
            character.bubble.classList.remove('slide-out');
            character.bubble.classList.add('visible');
            
            // Auto-hide after 4 seconds
            setTimeout(() => {
                this.hideBubble(sectionId);
            }, 4000);
        }
    }
    
    hideBubble(sectionId) {
        const character = this.characters.get(sectionId);
        if (character) {
            character.bubble.classList.remove('visible');
        }
    }
}

// Initialize when DOM is ready
function initSectionCharacterGuide() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SectionCharacterGuide();
        });
    } else {
        new SectionCharacterGuide();
    }
}

// Start the character guide
initSectionCharacterGuide();