// Game Initialization
let gameSeq = [];
let userSeq = [];
let started = false;
let level = 0;
let score = 0;
let highScore = localStorage.getItem('simonHighScore') || 0;
let soundEnabled = true;
let currentTheme = 'default';

// DOM Elements
const startBtn = document.getElementById('start-btn');
const helpBtn = document.getElementById('help-btn');
const soundToggle = document.getElementById('sound-toggle');
const themeToggle = document.getElementById('theme-toggle');
const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const highScoreDisplay = document.getElementById('high-score');
const statusMessage = document.getElementById('status-message');
const progressBar = document.getElementById('progress-bar');
const currentSequence = document.getElementById('current-sequence');
const sequenceLength = document.getElementById('sequence-length');
const instructionsModal = document.getElementById('instructions-modal');
const closeModal = document.querySelector('.close-modal');

// Audio Context for Sounds
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const notes = {
    'C4': 261.63,
    'E4': 329.63,
    'G4': 392.00,
    'A4': 440.00
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    highScoreDisplay.textContent = highScore;
    updateStatus('Ready to play? Press START!', 'info');
    
    // Initialize particles
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#7a5af8" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#7a5af8",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Game Instructions Alert (First time only)
    if(!localStorage.getItem('simonInstructionsShown')) {
        setTimeout(() => {
            showInstructions();
            localStorage.setItem('simonInstructionsShown', 'true');
        }, 1000);
    }
});

// Event Listeners
startBtn.addEventListener('click', startGame);
helpBtn.addEventListener('click', showInstructions);
soundToggle.addEventListener('click', toggleSound);
themeToggle.addEventListener('click', toggleTheme);
closeModal.addEventListener('click', hideInstructions);

// Modal close on outside click
window.addEventListener('click', (e) => {
    if(e.target === instructionsModal) {
        hideInstructions();
    }
});

// Game Functions
function startGame() {
    if (!started) {
        started = true;
        gameSeq = [];
        userSeq = [];
        level = 1;
        score = 0;
        
        updateDisplays();
        updateStatus('Watch the sequence carefully!', 'warning');
        startBtn.innerHTML = '<i class="fas fa-redo"></i><span>Restart Game</span>';
        startBtn.classList.add('pulse');
        
        setTimeout(() => {
            levelUp();
        }, 1000);
    } else {
        // Restart game
        started = false;
        startGame();
    }
}

function levelUp() {
    userSeq = [];
    updateStatus(`Level ${level} - Watch closely!`, 'warning');
    updateProgressBar(0);
    
    // Add random color to sequence
    const colors = ['yellow', 'red', 'purple', 'green'];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    gameSeq.push(randColor);
    
    // Update displays
    updateDisplays();
    currentSequence.textContent = gameSeq.map(color => color.charAt(0).toUpperCase()).join('');
    sequenceLength.textContent = gameSeq.length;
    
    // Play sequence with delays
    playSequence(0);
}

function playSequence(index) {
    if(index < gameSeq.length) {
        const color = gameSeq[index];
        const btn = document.querySelector(`.${color}`);
        
        setTimeout(() => {
            gameFlash(btn);
            playSound(color);
            
            setTimeout(() => {
                playSequence(index + 1);
            }, 500);
        }, 600);
    } else {
        updateStatus('Your turn! Repeat the sequence.', 'success');
        userSeq = [];
    }
}

function gameFlash(btn) {
    btn.classList.add('gameFlash');
    setTimeout(() => {
        btn.classList.remove('gameFlash');
    }, 300);
}

function userFlash(btn) {
    btn.classList.add('userFlash');
    setTimeout(() => {
        btn.classList.remove('userFlash');
    }, 200);
}

function playSound(color) {
    if(!soundEnabled) return;
    
    const note = document.querySelector(`.${color}`).dataset.sound;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = notes[note];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Button Press Handler
const allBtns = document.querySelectorAll('.btn');
allBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if(!started || userSeq.length >= gameSeq.length) return;
        
        const userColor = this.id;
        userSeq.push(userColor);
        
        userFlash(this);
        playSound(userColor);
        
        // Update progress
        const progress = (userSeq.length / gameSeq.length) * 100;
        updateProgressBar(progress);
        
        // Check answer
        checkAns(userSeq.length - 1);
    });
});

function checkAns(idx) {
    if(userSeq[idx] === gameSeq[idx]) {
        if(userSeq.length === gameSeq.length) {
            // Correct sequence
            score += level * 10;
            level++;
            
            updateStatus(`Perfect! Get ready for level ${level}`, 'success');
            updateDisplays();
            
            // Visual feedback
            document.body.style.backgroundColor = 'var(--success)';
            setTimeout(() => {
                document.body.style.backgroundColor = '';
            }, 150);
            
            setTimeout(() => {
                levelUp();
            }, 1200);
        }
    } else {
        // Game Over
        gameOver();
    }
}

function gameOver() {
    started = false;
    
    if(score > highScore) {
        highScore = score;
        localStorage.setItem('simonHighScore', highScore);
        updateStatus(`New High Score! ${score} points!`, 'success');
    } else {
        updateStatus(`Game Over! Score: ${score}`, 'danger');
    }
    
    highScoreDisplay.textContent = highScore;
    
    // Visual feedback
    document.body.style.backgroundColor = 'var(--danger)';
    setTimeout(() => {
        document.body.style.backgroundColor = '';
    }, 300);
    
    // Reset button
    startBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Again</span>';
    startBtn.classList.remove('pulse');
    
    // Show game over animation
    allBtns.forEach(btn => {
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = 'shake 0.5s ease';
        }, 10);
    });
}

// UI Functions
function updateDisplays() {
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    highScoreDisplay.textContent = highScore;
}

function updateStatus(message, type) {
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'warning' ? 'fa-exclamation-circle' : 
                 type === 'danger' ? 'fa-times-circle' : 'fa-info-circle';
    
    statusMessage.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    statusMessage.style.color = `var(--${type})`;
}

function updateProgressBar(percentage) {
    progressBar.style.width = `${percentage}%`;
    progressBar.style.background = percentage === 100 ? 
        'linear-gradient(90deg, var(--success), #34d399)' : 
        'linear-gradient(90deg, var(--accent), var(--accent-light))';
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = soundToggle.querySelector('i');
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    updateStatus(soundEnabled ? 'Sound enabled' : 'Sound muted', 'info');
}

function toggleTheme() {
    const themes = ['default', 'dark', 'pastel'];
    const currentIndex = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIndex + 1) % themes.length];
    
    // Apply theme
    document.documentElement.style.setProperty('--primary-bg', 
        currentTheme === 'dark' ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' :
        currentTheme === 'pastel' ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' :
        'linear-gradient(135deg, #0a1929 0%, #1a1a2e 100%)'
    );
    
    updateStatus(`Theme changed to ${currentTheme}`, 'info');
}

function showInstructions() {
    instructionsModal.style.display = 'flex';
}

function hideInstructions() {
    instructionsModal.style.display = 'none';
}

// Add shake animation for game over
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .pulse {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

