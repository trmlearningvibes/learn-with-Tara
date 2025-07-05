class MatchingGame {
    constructor() {
        this.currentGame = 'opposites';
        this.selectedItem = null; // Track the currently selected item
        this.matches = {
            opposites: {
                'night': 'day',
                'tall': 'short', // giraffe | mouse
                'hot': 'cold',
                'happy': 'sad',
                'up': 'down',
                'fast': 'slow', // cheetah | tortoise
                'sleeping': 'awake',
                'quiet': 'loud'  // sshh | shout
            },
            letters: {
                'apple': 'a',
                'ball': 'b',
                'cat': 'c',
                'dog': 'd',
                'egg': 'e',
                'flower': 'f',
                'grapes': 'g',
                'hat': 'h',
                'kite': 'k',
                'lion': 'l',
                'monkey': 'm',
                'needle': 'n',
                'owl': 'o',
                'penguin': 'p',
                'queen': 'q',
                'rabbit': 'r',
                'swing': 's',
                'tiger': 't',
                'umbrella': 'u',
                'violin': 'v',
                'watermelon': 'w',
                'yo-yo': 'y', // Changed from 'yak': 'y'
                'zebra': 'z'
            },
            animal_homes: { // Renamed from 'animals'
                'fish': 'sea',
                'bird': 'nest',
                'rabbit': 'burrow',
                'bee': 'hive',
                'spider': 'web',
                'monkey': 'tree',
                'penguin': 'igloo',
                'child': 'house'
            },
            capital_small: { // This is the new game
                'A': 'a', 'B': 'b', 'D': 'd', 'E': 'e', 'F': 'f', 'G': 'g',
                'H': 'h', 'I': 'i', 'J': 'j', 'L': 'l', 'M': 'm', 'N': 'n',
                'Q': 'q', 'R': 'r'
                // Removed C, K, O, P, S, T, U, V, W, X, Y, Z
            },
            number_fruits: {
                '1': '🍎',
                '2': '🍌🍌',
                '3': '🍓🍓🍓',
                '4': '🍇🍇🍇🍇',
                '5': '🍊🍊🍊🍊🍊',
                '6': '🥝🥝🥝🥝🥝🥝',
                '7': '🍒🍒🍒🍒🍒🍒🍒',
                '8': '🍍🍍🍍🍍🍍🍍🍍🍍',
                '9': '🍑🍑🍑🍑🍑🍑🍑🍑🍑',
                '10': '🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉'
            },
            spelling: {
                'Cat': 'cat',
                'Dog': 'dog',
                'Star': 'star',
                'Sun': 'sun',
                'Bus': 'bus',
                'Cow': 'cow',
                'Egg': 'egg',
                'Ball': 'ball',
                'Lion': 'lion'
            }
        };
        this.gameOrder = ['opposites', 'letters', 'animal_homes', 'capital_small', 'number_fruits', 'spelling']; // Updated 'animals' to 'animal_homes'
        this.currentGameIndex = 0;
        this.matchedCount = 0;
        this.tilesPerGame = 5; // Show 5 random pairs per game
        this.originalGameStates = {}; // Store original HTML for each game
        
        this.saveOriginalStates();
        this.init();
    }

    saveOriginalStates() {
        this.gameOrder.forEach(gameType => {
            const gameElement = document.getElementById(`${gameType}-game`);
            if (gameElement) {
                this.originalGameStates[gameType] = gameElement.innerHTML;
            }
        });
    }

    init() {
        this.setupEventListeners();
        this.setupTouchEvents();
        this.loadGame(this.currentGame);
    }

    setupEventListeners() {
        // Game selector buttons
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const game = e.target.dataset.game;
                this.switchGame(game);
            });
        });

        // Next game button
        document.getElementById('next-game').addEventListener('click', () => {
            this.nextGame();
        });
    }
    
    setupTouchEvents() {
        this.setupTouchSelection();
    }

    setupTouchSelection() {
        // Remove existing event listeners by cloning elements
        document.querySelectorAll('.match-item').forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });
        
        document.querySelectorAll('.match-target').forEach(target => {
            const newTarget = target.cloneNode(true);
            target.parentNode.replaceChild(newTarget, target);
        });
        
        // Add touch/click events for selection-based matching
        document.querySelectorAll('.match-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleItemSelection(item);
            });
            
            item.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleItemSelection(item);
            });
        });

        document.querySelectorAll('.match-target').forEach(target => {
            target.addEventListener('click', (e) => {
                this.handleTargetSelection(target);
            });
            
            target.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleTargetSelection(target);
            });
        });
    }

    handleItemSelection(item) {
        if (item.classList.contains('matched')) return;
        
        // Clear previous selection
        this.clearSelections();
        
        // Select this item
        this.selectedItem = item;
        item.classList.add('selected');
    }

    handleTargetSelection(target) {
        if (target.classList.contains('matched')) return;
        
        if (this.selectedItem) {
            const itemMatch = this.selectedItem.dataset.match;
            const targetMatch = target.dataset.target;
            
            if (this.matches[this.currentGame][itemMatch] === targetMatch) {
                // Correct match
                this.makeMatch(this.selectedItem, target);
            } else {
                // Wrong match
                this.showWrongMatch(this.selectedItem, target);
            }
            
            this.clearSelections();
        } else {
            // No item selected, just highlight target briefly
            target.classList.add('selected');
            setTimeout(() => {
                target.classList.remove('selected');
            }, 300);
        }
    }

    clearSelections() {
        document.querySelectorAll('.match-item, .match-target').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedItem = null;
    }

    makeMatch(item, target) {
        // Highlight both as correct (green)
        item.classList.add('correct-match');
        target.classList.add('correct-match');
        
        // After a brief moment, make them disappear
        setTimeout(() => {
            item.classList.add('matched');
            target.classList.add('matched');
            
            // Fade out animation
            item.style.opacity = '0';
            target.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            target.style.transform = 'scale(0.8)';
              // Make invisible instead of removing from DOM after animation
            setTimeout(() => {
                if (item.parentElement) {
                    item.style.visibility = 'hidden'; // Changed from item.remove()
                }
                if (target.parentElement) {
                    target.style.visibility = 'hidden'; // Changed from target.remove()
                }
            }, 300);
            
        }, 500);
          // Play success sound (visual feedback)
        this.showSuccess();
          this.matchedCount++;
        
        // Check if game is complete (all 5 pairs matched)
        if (this.matchedCount >= this.tilesPerGame) {
            // Game complete - show celebration
            // console.log('Game complete! Showing celebration...'); // Removed console.log
            setTimeout(() => {
                this.showCelebration();
            }, 800);
        }
    }

    showWrongMatch(item, target) {
        // Highlight both as wrong (red) and vibrate
        item.classList.add('wrong-match');
        target.classList.add('wrong-match');
        
        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // Shake animation
        item.style.animation = 'shake 0.5s ease-in-out';
        target.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            item.classList.remove('wrong-match');
            target.classList.remove('wrong-match');
            item.style.animation = '';
            target.style.animation = '';
        }, 500);
    }

    showSuccess() {
        // Create floating success emoji
        const success = document.createElement('div');
        success.innerHTML = '⭐'; // Can be randomized too
        success.style.position = 'fixed';
        success.style.fontSize = '3rem';
        success.style.zIndex = '1500';
        success.style.pointerEvents = 'none';
        success.style.left = Math.random() * window.innerWidth + 'px';
        success.style.top = '50%';
        success.style.animation = 'float 2s ease-out forwards';
        
        document.body.appendChild(success);
        
        setTimeout(() => {
            success.remove();
        }, 2000);
    }    showCelebration() {
        // console.log('showCelebration() called'); // Removed console.log
        
        // Update celebration image based on current game
        const celebrationImage = document.getElementById('celebration-image');
        const gameImages = {
            'opposites': 'tara opposites.png',
            'letters': 'tara letters.png',
            'animal_homes': 'tara animals.png', // Updated 'animals' to 'animal_homes'
            'capital_small': 'tara letters.png', // Added for the new game
            'number_fruits': 'tara numbers celebration.png', // Updated for the number_fruits game
            'spelling': 'tara letters.png' // Added for the spelling game
        };
        
        // console.log('Found celebration image element:', celebrationImage); // Removed console.log
        
        if (celebrationImage && gameImages[this.currentGame]) {
            celebrationImage.src = gameImages[this.currentGame];
            celebrationImage.alt = `Tara ${this.currentGame} celebration`;
            // console.log('Updated celebration image to:', gameImages[this.currentGame]); // Removed console.log
        }
        
        const celebrationElement = document.getElementById('celebration');
        // console.log('Found celebration element:', celebrationElement); // Removed console.log
        
        if (celebrationElement) {
            celebrationElement.classList.add('show');
            // console.log('Added show class to celebration'); // Removed console.log
        }
        
        // Create confetti effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createConfetti();
            }, i * 100);
        }
    }

    createConfetti() {
        const confetti = document.createElement('div');
        const emojis = ['🎉', '🎊', '⭐', '🌟', '✨', '🎈'];
        confetti.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.fontSize = '2rem';
        confetti.style.zIndex = '2500';
        confetti.style.pointerEvents = 'none';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-50px';
        confetti.style.animation = 'fall 3s linear forwards';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();        }, 3000);
    }
    
    switchGame(gameType) {
        this.currentGame = gameType;
        this.currentGameIndex = this.gameOrder.indexOf(gameType);
        this.loadGame(gameType);
        
        // Update active button
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.game === gameType) {
                btn.classList.add('active');
            }
        });
    }    getCurrentGameMatches() {
        const allMatches = Object.keys(this.matches[this.currentGame]);
        // Shuffle and take first 5 matches
        const shuffledMatches = [...allMatches];
        this.shuffleArray(shuffledMatches);
        return shuffledMatches.slice(0, this.tilesPerGame);
    }/*getTotalSetsForGame() { // Method removed
        const totalMatches = Object.keys(this.matches[this.currentGame]).length;
        const totalSets = Math.ceil(totalMatches / this.tilesPerSet);
        // console.log(`getTotalSetsForGame: ${this.currentGame} has ${totalMatches} matches, ${totalSets} sets with ${this.tilesPerSet} tiles per set`); // Removed console.log
        return totalSets;
    }*/
    
    loadGame(gameType) {
        // Hide all games
        document.querySelectorAll('.game').forEach(game => {
            game.classList.remove('active');
        });
        
        // Show selected game
        document.getElementById(gameType + '-game').classList.add('active');
        
        // Reset game state
        this.resetGame();
        
        // Load current set of tiles
        this.loadCurrentSet();
        
        // Setup touch selection for the new game content
        this.setupTouchSelection();
    }

    loadCurrentSet() {
        const currentGameElement = document.getElementById(`${this.currentGame}-game`);
        if (!currentGameElement) return;
        
        const leftContainer = currentGameElement.querySelector('.left-column');
        const rightContainer = currentGameElement.querySelector('.right-column');
        
        if (!leftContainer || !rightContainer) return;
        
        // Clear containers
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';
        
        // Get current set of matches
        const currentMatches = this.getCurrentGameMatches();
        
        // Create arrays for items and targets
        const matchItems = [];
        const matchTargets = [];
        
        // Get the emoji mappings from the original HTML
        const emojiMappings = this.getEmojiMappings();
        
        currentMatches.forEach(matchKey => {
            const targetValue = this.matches[this.currentGame][matchKey];
            
            // Create match item
            const item = document.createElement('div');
            item.className = 'match-item';
            item.dataset.match = matchKey;
            item.innerHTML = emojiMappings.items[matchKey] || matchKey;
            matchItems.push(item);
            
            // Create match target
            const target = document.createElement('div');
            target.className = 'match-target';
            target.dataset.target = targetValue;

            // Reverted: Always use the direct mapping for innerHTML
            target.innerHTML = emojiMappings.targets[targetValue] || targetValue;
            
            matchTargets.push(target);
        });
        
        // Shuffle both arrays
        this.shuffleArray(matchItems);
        this.shuffleArray(matchTargets);
        
        // Add to containers
        matchItems.forEach(item => leftContainer.appendChild(item));
        matchTargets.forEach(target => rightContainer.appendChild(target));
    }

    getEmojiMappings() {
        // Define emoji mappings for each game type
        const mappings = {
            opposites: {
                items: {
                    'night': '🌙',
                    'tall': '🦒', // (giraffe)
                    'hot': '🔥',
                    'happy': '😊',
                    'up': '⬆️',
                    'fast': '🐆', // (cheetah)
                    'sleeping': '😴',
                    'quiet': '🤫'  // (sshh)
                },
                targets: {
                    'day': '☀️',
                    'short': '🐭', // (mouse)
                    'cold': '❄️',
                    'sad': '😢',
                    'down': '⬇️',
                    'slow': '🐢', // (tortoise)
                    'awake': '👀',
                    'loud': '🗣️'   // (shout)
                }
            },
            letters: {
                items: {
                    'apple': '🍎',
                    'ball': '⚽',
                    'cat': '🐱',
                    'dog': '🐶',
                    'egg': '🥚',
                    'flower': '🌸',
                    'grapes': '🍇',
                    'hat': '👒',
                    'kite': '🪁',
                    'lion': '🦁',
                    'monkey': '🐵',
                    'needle': '🪡',
                    'owl': '🦉',
                    'penguin': '🐧',
                    'queen': '👸', // Changed from 👑
                    'rabbit': '🐰',
                    'swing': '🛝',
                    'tiger': '🐅',
                    'umbrella': '☂️',
                    'violin': '🎻',
                    'watermelon': '🍉',
                    'yo-yo': '🪀', // Changed from 'yak': '🐃'
                    'zebra': '🦓'
                },
                targets: { // Targets are the letters themselves
                    'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E',
                    'f': 'F', 'g': 'G', 'h': 'H', 'i': 'I', 'j': 'J',
                    'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O',
                    'p': 'P', 'q': 'Q', 'r': 'R', 's': 'S', 't': 'T',
                    'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y',
                    'z': 'Z'
                }
            },
            animal_homes: { // Renamed from 'animals'
                items: {
                    'fish': '🐠',
                    'bird': '🐦',
                    'rabbit': '🐰',
                    'bee': '🐝',
                    'spider': '🕷️',
                    'monkey': '🐵',
                    'penguin': '🐧',
                    'child': '👶'
                },                
                targets: {
                    'sea': '🌊',
                    'nest': '🪺',
                    'burrow': '🕳️',
                    'hive': '🍯', // Beehive emoji
                    'web': '🕸️',
                    'tree': '🌳',
                    'igloo': '🧊',
                    'house': '🏠'
                }
            },
            capital_small: {
                items: {
                    'A': 'A', 'B': 'B', 'D': 'd', 'E': 'E', 'F': 'F', 'G': 'G',
                    'H': 'H', 'I': 'I', 'J': 'J', 'L': 'L', 'M': 'M', 'N': 'N',
                    'Q': 'Q', 'R': 'R'
                     // Removed C, K, O, P, S, T, U, V, W, X, Y, Z
                },
                targets: {
                    'a': 'a', 'b': 'b', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g',
                    'h': 'h', 'i': 'i', 'j': 'j', 'l': 'l', 'm': 'm', 'n': 'n',
                    'q': 'q', 'r': 'r'
                    // Removed c, k, o, p, s, t, u, v, w, x, y, z
                }
            },
            number_fruits: {
                items: {
                    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
                    '6': '6', '7': '7', '8': '8', '9': '9', '10': '10'
                },
                targets: {
                    '🍎': '🍎',
                    '🍌🍌': '🍌🍌',
                    '🍓🍓🍓': '🍓🍓🍓',
                    '🍇🍇🍇🍇': '🍇🍇🍇🍇',
                    '🍊🍊🍊🍊🍊': '🍊🍊🍊🍊🍊',
                    '🥝🥝🥝🥝🥝🥝': '🥝🥝🥝🥝🥝🥝',
                    '🍒🍒🍒🍒🍒🍒🍒': '🍒🍒🍒🍒🍒🍒🍒',
                    '🍍🍍🍍🍍🍍🍍🍍🍍': '🍍🍍🍍🍍🍍🍍🍍🍍',
                    '🍑🍑🍑🍑🍑🍑🍑🍑🍑': '🍑🍑🍑🍑🍑🍑🍑🍑🍑',
                    '🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉': '🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉'
                }
            },
            spelling: {
                items: {
                    'Cat': 'Cat',
                    'Dog': 'Dog',
                    'Star': 'Star',
                    'Sun': 'Sun',
                    'Bus': 'Bus',
                    'Cow': 'Cow',
                    'Egg': 'Egg',
                    'Ball': 'Ball',
                    'Lion': 'Lion'
                },
                targets: {
                    'cat': '🐱',
                    'dog': '🐶',
                    'star': '⭐',
                    'sun': '☀️',
                    'bus': '🚌',
                    'cow': '🐮',
                    'egg': '🥚',
                    'ball': '⚽',
                    'lion': '🦁'
                }
            }
        };
        
        return mappings[this.currentGame] || { items: {}, targets: {} };
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /*showNextSetMessage() { // Method removed
        // Create a cheerful message for loading next set
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        message.style.color = 'white';
        message.style.padding = '20px 40px';
        message.style.borderRadius = '20px';
        message.style.fontSize = '2rem';
        message.style.fontWeight = 'bold';
        message.style.zIndex = '2000';
        message.style.textAlign = 'center';
        message.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        message.innerHTML = `Great job! 🌟<br>Let's do more!`;
        
        document.body.appendChild(message);
          setTimeout(() => {
            message.remove();
            this.matchedCount = 0; // Reset count for new set
            this.loadCurrentSet(); // Load next set
            this.setupTouchSelection(); // Re-setup touch events
        }, 2000);
    }*/
    
    resetGame() {
        this.matchedCount = 0;
        this.selectedItem = null;
        // this.currentSetIndex = 0; // Removed currentSetIndex usage
        
        // Hide celebration
        document.getElementById('celebration').classList.remove('show');
    }

    nextGame() {
        this.currentGameIndex = (this.currentGameIndex + 1) % this.gameOrder.length;
        const nextGameType = this.gameOrder[this.currentGameIndex];
        this.switchGame(nextGameType);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes float {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
    }
    
    @keyframes fall {
        0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    .match-item.selected {
        background: linear-gradient(135deg, #ffecd2, #fcb69f) !important;
        border: 3px solid #ff6b6b;
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MatchingGame();
});

// Prevent default touch behaviors that might interfere with the game
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
});

document.addEventListener('gestureend', (e) => {
    e.preventDefault();
});
