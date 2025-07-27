// DOM Elements
const modeSelectionScreen = document.getElementById('mode-selection');
const touchModeBtn = document.getElementById('touch-mode-btn');
const keyboardModeBtn = document.getElementById('keyboard-mode-btn');
const easyModeBtn = document.getElementById('easy-mode-btn');
const difficultModeBtn = document.getElementById('difficult-mode-btn');
const startGameBtn = document.getElementById('start-game-btn');
const startGameContainer = document.getElementById('start-game-container');
const inputStatus = document.getElementById('input-status');
const difficultyStatus = document.getElementById('difficulty-status');

const gameContainer = document.getElementById('game-container');
const wordImage = document.getElementById('word-image');
const letterBlanksContainer = document.getElementById('letter-blanks');
const letterOptionsContainer = document.getElementById('letter-options');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackMessage = document.getElementById('feedback-message');
const hintButton = document.getElementById('hint-button');
const successModal = document.getElementById('success-modal');
const playAgainButton = document.getElementById('play-again-button');
const homeButton = document.getElementById('home-button'); // Existing home button
const modeIndicator = document.getElementById('mode-indicator');
const backToModesButton = document.getElementById('back-to-modes');
const starCelebration = document.getElementById('star-celebration');


// Game State
let currentMode = ''; // 'touch' or 'keyboard'
let currentDifficultyLevel = ''; // 'easy' or 'difficult'
let currentWord = {};
let currentWordIndex = 0;
let score = 0;
let attempts = 0;
let filledBlanks = 0;
let shuffledWords = [];
let hintUsed = false;
let gameActive = false;

// Word Data with Images
const easyWordsArray = [
    { word: "bag", image: "images/bag.png" },
    { word: "bat", image: "images/bat.png" },
    { word: "bed", image: "images/bed.jpg" },
    { word: "box", image: "images/box.png" },
    { word: "bug", image: "images/bug.png" },
    { word: "bun", image: "images/bun.jpg" },
    { word: "bus", image: "images/bus.png" },
    { word: "cab", image: "images/cab.png" },
    { word: "can", image: "images/can.png" },
    { word: "cap", image: "images/cap.png" },
    { word: "cat", image: "images/cat.png" },
    { word: "cup", image: "images/cup.png" },
    { word: "cut", image: "images/cut.png" },
    { word: "dad", image: "images/dad.png" },
    { word: "dig", image: "images/dig.jpg" },
    { word: "dog", image: "images/dog.jpg" },
    { word: "fan", image: "images/fan.png" },
    { word: "fin", image: "images/fin.png" },
    { word: "fox", image: "images/fox.png" },
    { word: "gap", image: "images/gap.png" },
    { word: "gas", image: "images/gas.png" },
    { word: "gun", image: "images/gun.jpg" },
    { word: "hat", image: "images/hat.png" },
    { word: "hen", image: "images/hen.jpg" },
    { word: "hop", image: "images/hop.jpg" },
    { word: "jam", image: "images/jam.png" },
    { word: "jug", image: "images/jug.jpg" },
    { word: "lap", image: "images/lap.png" },
    { word: "leg", image: "images/leg.png" },
    { word: "lid", image: "images/lid.png" },
    { word: "lip", image: "images/lip.jpg" },
    { word: "log", image: "images/log.jpg" },
    { word: "man", image: "images/man.png" },
    { word: "map", image: "images/map.png" },
    { word: "mat", image: "images/mat.png" },
    { word: "nap", image: "images/nap.png" },
    { word: "pan", image: "images/pan.png" },
    { word: "pen", image: "images/pen.png" },
    { word: "pig", image: "images/pig.png" },
    { word: "pin", image: "images/pin.jpg" },
    { word: "pop", image: "images/pop.png" },
    { word: "pot", image: "images/pot.jpg" },
    { word: "rat", image: "images/rat.png" },
    { word: "run", image: "images/run.png" },
    { word: "sad", image: "images/sad.png" },
    { word: "sip", image: "images/sip.jpg" },
    { word: "sit", image: "images/sit.png" },
    { word: "tag", image: "images/tag.png" },
    { word: "tap", image: "images/tap.png" },
    { word: "tub", image: "images/tub.jpg" },
    { word: "van", image: "images/van.png" },
    { word: "wag", image: "images/wag.png" },
    { word: "wax", image: "images/wax.png" },
    { word: "web", image: "images/web.png" },
    { word: "yak", image: "images/yak.png" },
    { word: "yam", image: "images/yam.png" },
    { word: "zip", image: "images/zip.jpg" }
];

const difficultWordsArray = [
    { word: "bird", image: "images/difficult/bird.jpg" },
    { word: "boat", image: "images/difficult/boat.jpg" },
    { word: "cheek", image: "images/difficult/cheek.jpg" },
    { word: "chick", image: "images/difficult/chick.jpg" },
    { word: "child", image: "images/difficult/child.jpg" },
    { word: "chin", image: "images/difficult/chin.jpg" },
    { word: "chip", image: "images/difficult/chip.png" },
    { word: "church", image: "images/difficult/church.png" },
    { word: "coin", image: "images/difficult/coin.jpg" },
    { word: "cook", image: "images/difficult/cook.jpg" },
    { word: "crown", image: "images/difficult/crown.png" },
    { word: "doctor", image: "images/difficult/doctor.png" },
    { word: "farmer", image: "images/difficult/farmer.jpg" },
    { word: "grandfather", image: "images/difficult/grandfather.jpg" },
    { word: "grandmother", image: "images/difficult/grandmother.jpg" },
    { word: "happy", image: "images/difficult/happy.jpg" },
    { word: "heel", image: "images/difficult/heel.jpg" },
    { word: "horse", image: "images/difficult/horse.png" },
    { word: "king", image: "images/difficult/king.jpg" },
    { word: "mirror", image: "images/difficult/mirror.png" },
    { word: "moon", image: "images/difficult/moon.jpg" },
    { word: "queen", image: "images/difficult/queen.png" },
    { word: "rain", image: "images/difficult/rain.jpg" },
    { word: "road", image: "images/difficult/road.jpg" },
    { word: "root", image: "images/difficult/root.jpg" },
    { word: "sauce", image: "images/difficult/sauce.jpg" },
    { word: "shark", image: "images/difficult/shark.jpg" },
    { word: "sheep", image: "images/difficult/sheep.png" },
    { word: "shell", image: "images/difficult/shell.png" },
    { word: "shirt", image: "images/difficult/shirt.png" },
    { word: "shoes", image: "images/difficult/shoes.png" },
    { word: "skirt", image: "images/difficult/skirt.jpg" },
    { word: "sleep", image: "images/difficult/sleep.jpg" },
    { word: "snow", image: "images/difficult/snow.png" },
    { word: "soap", image: "images/difficult/soap.jpg" },
    { word: "stairs", image: "images/difficult/stairs.png" },
    { word: "stitch", image: "images/difficult/stitch.jpg" },
    { word: "stone", image: "images/difficult/stone.jpg" },
    { word: "swing", image: "images/difficult/swing.png" },
    { word: "tractor", image: "images/difficult/tractor.png" }
];


const wordData = {
    easy: easyWordsArray,
    difficult: difficultWordsArray
};
let currentWordList = [];

// Sound Effects (assuming these are defined or will be added)
// const correctSound = new Audio('sounds/correct.mp3');
// const wrongSound = new Audio('sounds/wrong.mp3');
// const winSound = new Audio('sounds/win.mp3');

// Initialize App
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    showModeSelection();
    setupEventListeners();
    // Any other initial setup
}

function setupEventListeners() {
    touchModeBtn.addEventListener('click', () => selectInputMode('touch'));
    keyboardModeBtn.addEventListener('click', () => selectInputMode('keyboard'));
    easyModeBtn.addEventListener('click', () => selectDifficulty('easy'));
    difficultModeBtn.addEventListener('click', () => selectDifficulty('difficult'));
    startGameBtn.addEventListener('click', startGame);

    hintButton.addEventListener('click', provideHint);
    playAgainButton.addEventListener('click', restartGame);
    homeButton.addEventListener('click', () => {
        successModal.style.display = 'none';
        showModeSelection();
    });
    backToModesButton.addEventListener('click', showModeSelection);
}

function showModeSelection() {
    modeSelectionScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    successModal.style.display = 'none';
    
    // Reset selections
    currentMode = '';
    currentDifficultyLevel = '';
    gameActive = false;
    
    // Reset button states
    document.querySelectorAll('.mode-button').forEach(btn => btn.classList.remove('selected'));
    
    // Reset status display
    inputStatus.textContent = 'Not Selected';
    inputStatus.classList.remove('selected');
    difficultyStatus.textContent = 'Not Selected';
    difficultyStatus.classList.remove('selected');
    
    // Hide start game button
    startGameContainer.style.display = 'none';
}

function selectInputMode(mode) {
    currentMode = mode;
    
    // Update button states
    touchModeBtn.classList.remove('selected');
    keyboardModeBtn.classList.remove('selected');
    
    if (mode === 'touch') {
        touchModeBtn.classList.add('selected');
        inputStatus.textContent = 'Touch 👆';
    } else {
        keyboardModeBtn.classList.add('selected');
        inputStatus.textContent = 'Keyboard ⌨️';
    }
    
    inputStatus.classList.add('selected');
    checkIfReadyToStart();
}

function selectDifficulty(difficulty) {
    currentDifficultyLevel = difficulty;
    
    // Update button states
    easyModeBtn.classList.remove('selected');
    difficultModeBtn.classList.remove('selected');
    
    if (difficulty === 'easy') {
        easyModeBtn.classList.add('selected');
        difficultyStatus.textContent = 'Easy 😊';
    } else {
        difficultModeBtn.classList.add('selected');
        difficultyStatus.textContent = 'Difficult 🧠';
    }
    
    difficultyStatus.classList.add('selected');
    checkIfReadyToStart();
}

function checkIfReadyToStart() {
    if (currentMode && currentDifficultyLevel) {
        startGameContainer.style.display = 'block';
    } else {
        startGameContainer.style.display = 'none';
    }
}

function startGame() {
    if (!currentMode || !currentDifficultyLevel) {
        return; // Safety check
    }
    
    modeSelectionScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    updateModeIndicator();
    initGame();
}

function updateModeIndicator() {
    const modeText = currentMode === 'touch' ? 'Touch 👆' : 'Keyboard ⌨️';
    const difficultyText = currentDifficultyLevel === 'easy' ? 'Easy 😊' : 'Difficult 🧠';
    modeIndicator.textContent = `${modeText} • ${difficultyText}`;
    
    if (currentMode === 'touch') {
        letterOptionsContainer.style.display = 'flex'; // Show letter options for touch mode
    } else if (currentMode === 'keyboard') {
        letterOptionsContainer.style.display = 'none'; // Hide letter options for keyboard mode
    }
}

function initGame() {
    if (!currentMode || !currentDifficultyLevel) {
        console.error("Mode or difficulty not set!");
        showModeSelection(); // Go back if something is wrong
        return;
    }

    currentWordList = wordData[currentDifficultyLevel];
    if (!currentWordList || currentWordList.length === 0) {
        console.error("Word list for selected difficulty is empty!");
        // Potentially show an error message to the user or default to easy
        currentWordList = wordData.easy; // Fallback or handle error
        if (!currentWordList || currentWordList.length === 0) {
            alert("No words available to play. Please check the configuration.");
            showModeSelection();
            return;
        }
    }
    
    currentWordIndex = 0;
    score = 0;
    attempts = 0;
    shuffledWords = shuffleArray([...currentWordList]);
    gameActive = true;
    loadWord();
    updateModeIndicator(); // Ensure mode indicator is set when game starts
    // Reset any game-specific UI elements if necessary
    feedbackMessage.textContent = '';
    feedbackContainer.style.display = 'none';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadWord() {
    if (currentWordIndex >= shuffledWords.length) {
        showSuccessModal();
        return;
    }
    currentWord = shuffledWords[currentWordIndex];
      // Set image source and handle loading
    wordImage.src = currentWord.image;
    wordImage.alt = `Picture of ${currentWord.word}`;
    
    // Handle image loading errors with fallback
    wordImage.onerror = function() {
        if (currentWord.fallbackImage && this.src !== currentWord.fallbackImage) {
            this.src = currentWord.fallbackImage;
        } else {
            // If fallback also fails, create a simple text placeholder
            this.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
                    <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="24" fill="#666">${currentWord.word.toUpperCase()}</text>
                </svg>
            `)}`;
        }
        this.alt = `Image for ${currentWord.word}`;
    };
      filledBlanks = 0;
    hintUsed = false;
    hintButton.disabled = false;
    feedbackMessage.textContent = '';
    feedbackContainer.style.display = 'none';

    renderLetterBlanks();
    if (currentMode === 'touch') {
        renderLetterOptions();
    } else {
        letterOptionsContainer.innerHTML = ''; // Clear options if not in touch mode
        focusFirstBlank();
    }
}

function renderLetterBlanks() {
    letterBlanksContainer.innerHTML = '';
    currentWord.word.split('').forEach((letter, index) => {
        const blank = document.createElement('input');
        blank.type = 'text';
        blank.classList.add('letter-blank');
        blank.maxLength = 1;
        blank.dataset.index = index;
        blank.dataset.letter = letter.toLowerCase(); // Store correct letter for checking
        blank.disabled = currentMode === 'touch'; // Disable input for touch mode initially
        
        if (currentMode === 'keyboard') {
            blank.addEventListener('input', handleKeyboardInput);
            blank.addEventListener('keydown', handleKeyboardNavigation);
        }
        letterBlanksContainer.appendChild(blank);
    });
}

function focusFirstBlank() {
    if (currentMode === 'keyboard') {
        const firstBlank = letterBlanksContainer.querySelector('.letter-blank');
        if (firstBlank) {
            firstBlank.focus();
        }
    }
}

function handleKeyboardInput(event) {
    if (!gameActive) return;
    const inputElement = event.target;
    const enteredValue = inputElement.value.toLowerCase();
    
    if (enteredValue.length > 0) { // Only process if there's an input
        const correctLetter = currentWord.word[inputElement.dataset.index].toLowerCase();
        if (enteredValue === correctLetter) {
            inputElement.classList.add('filled', 'correct');
            inputElement.classList.remove('wrong');
            inputElement.disabled = true;
            // correctSound.play(); // Uncomment if sound is added
            filledBlanks++;
            checkWordCompletion();

            // Move to next blank
            const nextBlank = inputElement.nextElementSibling;
            if (nextBlank && nextBlank.classList.contains('letter-blank') && !nextBlank.disabled) {
                nextBlank.focus();
            } else if (!nextBlank && filledBlanks < currentWord.word.length) {
                // If it's the last blank but word not complete, find first empty non-disabled blank
                const firstEmptyBlank = Array.from(letterBlanksContainer.children).find(b => !b.disabled && b.value === '');
                if (firstEmptyBlank) firstEmptyBlank.focus();
            }        } else {
            inputElement.classList.add('wrong');
            inputElement.value = ''; // Clear wrong input
            // wrongSound.play(); // Uncomment if sound is added
            animateShake(inputElement);
            // Remove wrong class after animation completes
            setTimeout(() => {
                inputElement.classList.remove('wrong');
            }, 600); // Match animation duration
            // Visual feedback only - no text message for wrong letters
        }
    }
}

function handleKeyboardNavigation(event) {
    if (!gameActive) return;
    const currentInput = event.target;
    const currentIndex = parseInt(currentInput.dataset.index);

    if (event.key === 'ArrowRight') {
        const nextInput = letterBlanksContainer.children[currentIndex + 1];
        if (nextInput) nextInput.focus();
        event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
        const prevInput = letterBlanksContainer.children[currentIndex - 1];
        if (prevInput) prevInput.focus();
        event.preventDefault();
    } else if (event.key === 'Backspace' && currentInput.value === '') {
        // If backspace on empty input, move to previous and clear if allowed
        const prevInput = letterBlanksContainer.children[currentIndex - 1];
        if (prevInput && !prevInput.disabled) { // Check if previous is not already correctly filled
            prevInput.focus();
        }
        event.preventDefault();
    }
}


function renderLetterOptions() {
    letterOptionsContainer.innerHTML = '';
    const letters = generateLetterOptions(currentWord.word);
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.classList.add('letter-option');
        button.textContent = letter.toUpperCase();
        button.addEventListener('click', (event) => handleTouchInput(letter, event));
        letterOptionsContainer.appendChild(button);
    });
}

function generateLetterOptions(word) {
    const correctLetters = Array.from(new Set(word.toLowerCase().split('')));
    let options = [...correctLetters];
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    
    // Add some random letters, ensuring options are around 8-10 total
    // More options for longer words if needed, but keep it simple for kids
    const numOptionsTarget = Math.min(10, Math.max(6, word.length + 3)); 

    while (options.length < numOptionsTarget) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!options.includes(randomLetter)) {
            options.push(randomLetter);
        }
    }
    return shuffleArray(options);
}

function handleTouchInput(selectedLetter, event) {
    if (!gameActive) return;
    const letter = selectedLetter.toLowerCase();
    const blanks = letterBlanksContainer.querySelectorAll('.letter-blank:not(.filled)');
    
    let letterPlaced = false;
    for (let i = 0; i < currentWord.word.length; i++) {
        const blank = letterBlanksContainer.children[i];
        if (!blank.classList.contains('filled') && currentWord.word[i].toLowerCase() === letter) {
            blank.value = letter.toUpperCase(); // Display letter
            blank.classList.add('filled', 'correct');
            blank.classList.remove('wrong'); // Remove any previous wrong class
            // correctSound.play(); // Uncomment
            filledBlanks++;
            letterPlaced = true;
            // Disable the chosen letter option to prevent re-selection for this specific correct placement
            // This needs more nuanced handling if a letter appears multiple times.
            // For simplicity, we'll allow re-clicking but it only fills one blank at a time.
            break; 
        }
    }
    
    if (letterPlaced) {
        checkWordCompletion();
    } else {
        // wrongSound.play(); // Uncomment
        // Visual feedback for wrong letters - apply to next available blank
        const nextBlank = letterBlanksContainer.querySelector('.letter-blank:not(.filled)');
        if (nextBlank) {
            nextBlank.classList.add('wrong');
            animateShake(nextBlank);
            // Remove wrong class after animation completes
            setTimeout(() => {
                nextBlank.classList.remove('wrong');
            }, 600); // Match animation duration
        }
        
        // Also provide feedback on the letter option button
        const buttonClicked = event.target;
        if (buttonClicked) {
            buttonClicked.classList.add('wrong');
            setTimeout(() => {
                buttonClicked.classList.remove('wrong');
            }, 400); // Match shake animation duration
        }
    }
}


function checkWordCompletion() {
    if (filledBlanks === currentWord.word.length) {
        // Word completed
        // correctSound.play(); // Play a slightly different sound for word completion
        showFeedback(`Correct! The word is ${currentWord.word.toUpperCase()}!`, 'correct');
        
        // Animate stars or other positive feedback
        triggerStarCelebration();

        // Disable options and hint button after word completion
        hintButton.disabled = true;
        if (currentMode === 'touch') {
            letterOptionsContainer.querySelectorAll('.letter-option').forEach(btn => btn.disabled = true);
        }

        gameActive = false; // Pause input until next word loads
        
        // Increment score first
        score++;
        
        // Check if we should show celebratory dialog every 5 words
        const shouldShowCelebration = (score % 5 === 0) && (currentWordIndex + 1 < shuffledWords.length);
        
        setTimeout(() => {
            currentWordIndex++;
            
            if (shouldShowCelebration) {
                showCelebratoryDialog();
            } else {
                gameActive = true; // Reactivate for next word
                loadWord();
            }
        }, 2500); // Delay before loading next word
    }
}

function triggerStarCelebration() {
    starCelebration.style.display = 'flex';
    starCelebration.classList.add('active');
    
    // Clear any existing content
    starCelebration.innerHTML = '';
    
    // Add one primary celebration star
    const primaryStar = document.createElement('div');
    primaryStar.classList.add('big-star');
    primaryStar.textContent = '🌟';
    starCelebration.appendChild(primaryStar);

    setTimeout(() => {
        starCelebration.style.display = 'none';
        starCelebration.classList.remove('active');
        starCelebration.innerHTML = ''; // Clear the star
    }, 2000);
}


function provideHint() {
    if (!gameActive) return;

    const unfilledBlanks = Array.from(letterBlanksContainer.querySelectorAll('.letter-blank:not(.filled)'));
    if (unfilledBlanks.length > 0) {
        const randomBlank = unfilledBlanks[Math.floor(Math.random() * unfilledBlanks.length)];
        const letterIndex = parseInt(randomBlank.dataset.index);
        const correctLetter = currentWord.word[letterIndex].toLowerCase();

        // Set the letter value for both touch and keyboard modes
        randomBlank.value = correctLetter.toUpperCase();
        if (currentMode === 'keyboard') {
            randomBlank.disabled = true; // Disable after hint in keyboard mode
        }
        randomBlank.classList.add('filled', 'hint-revealed');
        randomBlank.classList.remove('wrong'); // Remove wrong if it was marked
        
        filledBlanks++;
        hintUsed = true;
        
        // Only disable hint button if all letters are filled or only one blank remains
        if (unfilledBlanks.length <= 1) {
            hintButton.disabled = true;
        }
        
        showFeedback(`Hint: Letter '${correctLetter.toUpperCase()}' revealed!`, 'hint');
        checkWordCompletion();
    } else {
        // All blanks are filled, disable hint
        hintButton.disabled = true;
    }
}

function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackContainer.className = 'feedback-container'; // Reset classes
    feedbackContainer.classList.add(type); // 'correct', 'wrong', 'hint'
    feedbackContainer.style.display = 'block';

    // Hide feedback after a few seconds, unless it's a persistent message like word completion
    if (type === 'wrong' || type === 'hint') {
        setTimeout(() => {
            if (feedbackMessage.textContent === message) { // Only hide if it's still the same message
                 feedbackContainer.style.display = 'none';
            }
        }, 2000);
    }
}

function animateShake(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

function showSuccessModal() {
    gameActive = false;
    successModal.style.display = 'flex';
    // winSound.play(); // Uncomment
}

function restartGame() {
    successModal.style.display = 'none';
    // No need to show mode selection here, just re-init the game with current settings
    initGame(); 
}

function showCelebratoryDialog() {
    // Create a temporary celebratory modal
    const celebrationModal = document.createElement('div');
    celebrationModal.classList.add('modal');
    celebrationModal.style.display = 'flex';
    celebrationModal.innerHTML = `
        <div class="modal-content celebration-modal">
            <h2>🎉 Amazing Progress! 🎉</h2>
            <div class="celebration">
                <p>You've spelled ${score} words correctly!</p>
                <div class="intrust-celebration">
                    <img src="intrust celebration.png" alt="Intrust Academy celebrating">
                </div>
                <p>Keep up the fantastic work!</p>
            </div>
            <button class="continue-button">Continue Playing</button>
        </div>
    `;
    
    document.body.appendChild(celebrationModal);
    
    // Add event listener to continue button
    const continueButton = celebrationModal.querySelector('.continue-button');
    continueButton.addEventListener('click', () => {
        document.body.removeChild(celebrationModal);
        gameActive = true;
        loadWord();
    });
    
    // Auto-continue after 5 seconds if user doesn't click
    setTimeout(() => {
        if (document.body.contains(celebrationModal)) {
            document.body.removeChild(celebrationModal);
            gameActive = true;
            loadWord();
        }
    }, 5000);
}

// Ensure all functions are correctly defined and called.
// Example: If sounds are used, ensure they are loaded and played.

// Initial call to setup the application
// document.addEventListener('DOMContentLoaded', initializeApp);
// initializeApp is already set to run on DOMContentLoaded
