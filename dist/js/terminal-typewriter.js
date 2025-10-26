// Terminal Typewriter Effect
class TerminalTypewriter {
    constructor() {
        this.init();
    }

    init() {
        // Wait a bit after page load, then start typing
        setTimeout(() => {
            this.startTypingSequence();
        }, 1000);
    }

    async startTypingSequence() {
        // First command: whoami
        await this.typeCommand('whoami-command', 'whoami', 'cursor1');
        await this.showOutput('name-output', 'cursor1');
        
        // Wait a bit, then second command
        await this.delay(800);
        document.getElementById('cursor2').style.display = 'inline';
        
        await this.typeCommand('role-command', 'cat role.txt', 'cursor2');
        await this.showOutput('role-output', 'cursor2');
    }

    async typeCommand(elementId, text, cursorId) {
        const element = document.getElementById(elementId);
        const cursor = document.getElementById(cursorId);
        
        // Type each character with random delay to simulate human typing
        for (let i = 0; i <= text.length; i++) {
            element.textContent = text.substring(0, i);
            await this.delay(this.getRandomTypingDelay());
        }
        
        // Wait a moment after typing is complete
        await this.delay(500);
    }

    async showOutput(outputId, cursorId) {
        const output = document.getElementById(outputId);
        const cursor = document.getElementById(cursorId);
        
        // Hide cursor and show output
        cursor.style.display = 'none';
        output.style.display = 'block';
        
        // Add a subtle fade-in effect
        output.style.opacity = '0';
        output.style.animation = 'fadeInTerminal 0.3s ease-in-out forwards';
        
        await this.delay(300);
    }

    getRandomTypingDelay() {
        // Random delay between 50-150ms to simulate human typing
        return Math.random() * 100 + 50;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add fade-in animation for terminal output
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInTerminal {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize typewriter effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TerminalTypewriter();
});