import"./modulepreload-polyfill-B5Qt9EMX.js";import"./mobile-nav-Dq8jP2Mc.js";const t=document.createElement("style");t.textContent=`
    @keyframes fadeInTerminal {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .blog-hero-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.1rem;
        width: 100%;
    }
    
    .blog-hero-content .hero-name {
        font-family: 'Courier New', 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 2.5rem;
        font-weight: 700;
        color: #00ff41;
        text-shadow: 0 0 10px #00ff41, 2px 2px 4px rgba(0, 0, 0, 0.7);
        margin: 0;
        animation: terminalGlow 2s ease-in-out infinite alternate;
        line-height: 1.1;
        text-align: center;
        width: 100%;
    }
    
    .blog-hero-content .terminal-line {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    
    .blog-hero-content .terminal-prompt {
        color: #00ff41;
        margin-right: 0.3rem;
    }
    
    .blog-hero-content .typewriter {
        color: #00ff41;
    }
    
    .blog-hero-content .cursor {
        color: #00ff41;
        animation: blink 1s infinite;
        font-weight: bold;
    }
    
    .blog-hero-content .terminal-output {
        color: #ffffff;
        text-shadow: 0 0 8px #ffffff, 1px 1px 2px rgba(0, 0, 0, 0.7);
        margin-top: 0.2rem;
        text-align: center;
        width: 100%;
        font-size: 2.5rem;
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .blog-hero-content .hero-name {
            font-size: 1.8rem;
        }
        
        .blog-hero-content .terminal-output {
            font-size: 1.8rem;
        }
    }
`;document.head.appendChild(t);document.addEventListener("DOMContentLoaded",()=>{});
