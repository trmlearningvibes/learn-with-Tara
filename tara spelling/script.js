// Word data with image URLs
const wordData = [
    { word: "CAT", imageUrl: "https://img.icons8.com/color/144/cat.png" },
    { word: "DOG", imageUrl: "https://img.icons8.com/color/144/dog.png" },
    { word: "SUN", imageUrl: "https://img.icons8.com/color/144/sun--v1.png" },
    { word: "ANT", imageUrl: "https://img.icons8.com/color/144/ant.png" },    { word: "HAT", imageUrl: "./images/hat.png" },
    { word: "MAT", imageUrl: "./images/mat.png" },    { word: "PIG", imageUrl: "https://img.icons8.com/color/144/pig.png" },
    { word: "FOX", imageUrl: "https://img.icons8.com/color/144/fox.png" },
    { word: "BOX", imageUrl: "./images/box.png" },
    { word: "BUS", imageUrl: "https://img.icons8.com/color/144/bus.png" },
    { word: "STAR", imageUrl: "https://img.icons8.com/color/144/star--v1.png" },    { word: "COW", imageUrl: "https://img.icons8.com/color/144/cow.png" },    { word: "BAT", imageUrl: "./images/bat.png" },
    { word: "TAP", imageUrl: "./images/tap.png" }
];

// Game state
let currentWordIndex = 0;
let currentWord = '';
let currentLetterIndex = 0;
let usedLetterIndices = [];
let wordsInCurrentRound = [];

// Sound effects
const correctSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3');
const wrongSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-negative-tone-interface-tap-2301.mp3');
const completedSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-completion-of-a-level-2063.mp3');

// DOM elements
const wordImageElement = document.getElementById('word-image');
const letterBlanksElement = document.getElementById('letter-blanks');
const letterOptionsElement = document.getElementById('letter-options');
const feedbackContainerElement = document.getElementById('feedback-container');
const feedbackMessageElement = document.getElementById('feedback-message');
const nextButtonElement = document.getElementById('next-button');
const successModal = document.getElementById('success-modal');
const playAgainButton = document.getElementById('play-again-button');
const starCelebration = document.getElementById('star-celebration');

// Initialize the game
function initGame() {
    // Reset game state
    currentWordIndex = 0;
    usedLetterIndices = [];
    
    // Shuffle and get words for this round
    wordsInCurrentRound = shuffleArray([...wordData]).slice(0, 5);
      // Start with the first word
    loadWord(0);
}

// Load a word and set up the UI
function loadWord(index) {
    // Hide feedback container
    feedbackContainerElement.style.display = 'none';
    
    // Reset letter index for new word
    currentLetterIndex = 0;
    usedLetterIndices = [];
    
    // Get the current word
    const wordObj = wordsInCurrentRound[index];
    currentWord = wordObj.word;
    
    // Set the image
    wordImageElement.src = wordObj.imageUrl;
    wordImageElement.alt = `Image for ${wordObj.word}`;
    
    // Create letter blanks
    createLetterBlanks(currentWord);
    
    // Create letter options
    createLetterOptions(currentWord);
}

// Create letter blanks for the word
function createLetterBlanks(word) {
    letterBlanksElement.innerHTML = '';
    
    for (let i = 0; i < word.length; i++) {
        const letterBlank = document.createElement('div');
        letterBlank.className = 'letter-blank';
        letterBlank.dataset.index = i;
        letterBlanksElement.appendChild(letterBlank);
    }
}

// Create letter options for the word
function createLetterOptions(word) {
    letterOptionsElement.innerHTML = '';
    
    // Create array with correct letters and some extra random letters
    let letters = word.split('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Add a fixed number of random letters (5 is a good middle ground for children)
    const extraLetters = 5;
    
    for (let i = 0; i < extraLetters; i++) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        letters.push(randomLetter);
    }
    
    // Shuffle the letters
    letters = shuffleArray(letters);
    
    // Create letter option buttons
    letters.forEach((letter, index) => {
        const letterOption = document.createElement('button');
        letterOption.className = 'letter-option';
        letterOption.textContent = letter;
        letterOption.dataset.letter = letter;
        letterOption.dataset.index = index;
        
        letterOption.addEventListener('click', () => {
            handleLetterClick(letterOption, letter);
        });
        
        letterOptionsElement.appendChild(letterOption);
    });
}

// Handle letter option click
function handleLetterClick(letterOption, letter) {
    const letterIndex = parseInt(letterOption.dataset.index);
    
    // Check if letter is already used
    if (usedLetterIndices.includes(letterIndex)) {
        return;
    }
    
    // Check if the letter is correct for the current position
    if (letter === currentWord[currentLetterIndex]) {
        // Play correct sound
        correctSound.play();
        
        // Mark letter as used
        usedLetterIndices.push(letterIndex);
        letterOption.classList.add('used');
        
        // Get the current blank space
        const blanks = letterBlanksElement.querySelectorAll('.letter-blank');
        const currentBlank = blanks[currentLetterIndex];
        
        // Fill in the letter
        currentBlank.textContent = letter;
        currentBlank.classList.add('filled');
        currentBlank.classList.add('correct');
        
        // Increment letter index
        currentLetterIndex++;
          // Check if word is complete
        if (currentLetterIndex === currentWord.length) {
            setTimeout(() => {
                showStarCelebration();
                setTimeout(() => {
                    checkWord();
                }, 1500);
            }, 300);
        }
    } else {
        // Play wrong sound
        wrongSound.play();
        
        // Shake the letter option
        letterOption.classList.add('wrong');
        setTimeout(() => {
            letterOption.classList.remove('wrong');
        }, 500);
    }
}

// Display star celebration
function showStarCelebration() {
    starCelebration.style.display = 'flex';
    setTimeout(() => {
        starCelebration.style.display = 'none';
    }, 1500);
}

// Check if the spelled word is correct
function checkWord() {
    // All letters are already checked during input, so the word is always correct here
    
    // Show feedback
    feedbackContainerElement.style.display = 'block';
    
    // Show congratulatory message
    feedbackMessageElement.textContent = "Wonderful! You spelled " + currentWord + " 👏";
    feedbackMessageElement.className = 'feedback-message correct';
    
    // Play celebrate animation
    wordImageElement.classList.add('celebrate');
    setTimeout(() => {
        wordImageElement.classList.remove('celebrate');
    }, 500);
    
    // Setup next button
    nextButtonElement.addEventListener('click', handleNextWord);
}

// Handle next word button click
function handleNextWord() {
    // Remove event listener
    nextButtonElement.removeEventListener('click', handleNextWord);
    
    // Move to next word
    currentWordIndex++;
      // Check if there are more words
    if (currentWordIndex < wordsInCurrentRound.length) {
        loadWord(currentWordIndex);
    } else {
        // Show success modal
        showSuccessModal();
    }
}

// Show success modal
function showSuccessModal() {
    completedSound.play();
    successModal.style.display = 'flex';
}

// Update progress bar function has been removed since we don't have a progress bar

// This function has been removed as we don't need difficulty levels anymore

// Utility function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Event listeners
playAgainButton.addEventListener('click', () => {
    successModal.style.display = 'none';
    initGame();
});

// Initialize the game on load
document.addEventListener('DOMContentLoaded', () => {
    // Preload sounds
    correctSound.load();
    wrongSound.load();
    completedSound.load();
    
    initGame();
});
