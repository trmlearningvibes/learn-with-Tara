class AnimalGeographyGame {
    constructor() {
        this.draggedAnimal = null;
        this.placedAnimals = new Set();
        this.totalAnimals = 9;
        this.celebrationStar = document.getElementById('celebrationStar');
        this.successMessage = document.getElementById('successMessage');
        
        this.initializeDragAndDrop();
        this.initializeDropZones();
    }

    initializeDragAndDrop() {
        const animals = document.querySelectorAll('.animal-card');
        
        animals.forEach(animal => {
            animal.addEventListener('dragstart', (e) => {
                this.draggedAnimal = animal;
                animal.classList.add('dragging');
                
                // Set drag data
                e.dataTransfer.setData('text/plain', animal.dataset.animal);
                e.dataTransfer.effectAllowed = 'move';
            });

            animal.addEventListener('dragend', (e) => {
                animal.classList.remove('dragging');
                this.draggedAnimal = null;
                
                // Remove drag-over effects from all drop zones
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('drag-over');
                });
            });

            // Touch events for mobile
            animal.addEventListener('touchstart', (e) => this.handleTouchStart(e, animal));
            animal.addEventListener('touchmove', (e) => this.handleTouchMove(e));
            animal.addEventListener('touchend', (e) => this.handleTouchEnd(e, animal));
        });
    }

    initializeDropZones() {
        // Handle drop zone drops
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                if (this.draggedAnimal) {
                    this.handleDrop(zone.dataset.continent, this.draggedAnimal);
                }
            });
        });
    }

    handleDrop(dropZone, animal) {
        const correctZone = animal.dataset.correct;
        const animalName = animal.querySelector('.animal-name').textContent;
        
        if (dropZone === correctZone) {
            // Correct placement!
            this.handleCorrectPlacement(animal, dropZone);
            console.log(`✅ ${animalName} placed correctly in ${dropZone}!`);
        } else {
            // Incorrect placement - gentle feedback  
            this.handleIncorrectPlacement(animal, dropZone, correctZone);
            console.log(`❌ ${animalName} doesn't live in ${dropZone}. Try again!`);
        }
    }

    handleCorrectPlacement(animal, zone) {
        // Mark animal as placed
        animal.classList.add('placed');
        this.placedAnimals.add(animal.dataset.animal);
        
        // Flash the continent green
        const continent = document.querySelector(`[data-continent="${zone}"]`);
        if (continent) {
            continent.classList.add('correct-placement');
            setTimeout(() => {
                continent.classList.remove('correct-placement');
            }, 1000);
        }
        
        // Show celebration star
        this.showCelebrationStar();
        
        // Show positive reinforcement message
        const animalName = animal.querySelector('.animal-name').textContent;
        const successMessages = [
            `🎉 Perfect! ${animalName} is home!`,
            `⭐ Excellent work! ${animalName} loves it here!`,
            `🌟 Amazing! ${animalName} is so happy!`,
            `🎊 Fantastic! You found ${animalName}'s home!`,
            `💫 Wonderful! ${animalName} is right where they belong!`
        ];
        
        const message = successMessages[Math.floor(Math.random() * successMessages.length)];
        this.showMessage(message, '#C8E6C9');
        
        // Check if game is complete
        if (this.placedAnimals.size === this.totalAnimals) {
            setTimeout(() => {
                this.showSuccessMessage();
            }, 1500);
        }
    }

    handleIncorrectPlacement(animal, wrongZone, correctZone) {
        // Gentle shake animation
        animal.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            animal.style.animation = '';
        }, 500);
        
        // Show a gentle hint
        this.showHint(animal, correctZone);
    }

    showHint(animal, correctZone) {
        const animalName = animal.querySelector('.animal-name').textContent;
        let hint = '';
        
        switch(correctZone) {
            case 'arctic':
                hint = `❄️ ${animalName} loves icy places at the very top of the world!`;
                break;
            case 'antarctica':
                hint = `🧊 ${animalName} lives at the bottom where it's super cold!`;
                break;
            case 'asia':
                hint = `🏔️ ${animalName} calls the big continent with mountains home!`;
                break;
            case 'africa':
                hint = `🌍 ${animalName} loves the warm continent in the middle!`;
                break;
            case 'australia':
                hint = `🏝️ ${animalName} hops around the island continent!`;
                break;
            case 'europe':
                hint = `🦌 ${animalName} lives in the northern continent!`;
                break;
            case 'north-america':
                hint = `🍁 ${animalName} roams the continent on the left side!`;
                break;
            case 'ocean':
                hint = `🌊 ${animalName} swims in the deep blue waters!`;
                break;
        }
        
        this.showMessage(hint, '#E3F2FD');
    }

    showCelebrationStar() {
        const rect = document.querySelector('.map-container').getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        this.celebrationStar.style.left = x + 'px';
        this.celebrationStar.style.top = y + 'px';
        this.celebrationStar.classList.add('animate');
        
        setTimeout(() => {
            this.celebrationStar.classList.remove('animate');
        }, 1500);
    }

    showSuccessMessage() {
        this.successMessage.classList.add('show');
        
        // Confetti effect
        this.createConfetti();
    }

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.innerHTML = ['🎉', '⭐', '🎊', '🌟'][Math.floor(Math.random() * 4)];
                confetti.style.cssText = `
                    position: fixed;
                    top: -50px;
                    left: ${Math.random() * 100}%;
                    font-size: 2em;
                    z-index: 1002;
                    pointer-events: none;
                    animation: fall 3s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
    }

    // Touch event handlers for mobile support
    handleTouchStart(e, animal) {
        this.draggedAnimal = animal;
        animal.classList.add('dragging');
        e.preventDefault();
    }

    handleTouchMove(e) {
        if (!this.draggedAnimal) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Remove previous drag-over effects
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
        
        // Add drag-over effect to current element
        if (elementBelow && elementBelow.classList.contains('drop-zone')) {
            elementBelow.classList.add('drag-over');
        }
    }

    handleTouchEnd(e, animal) {
        if (!this.draggedAnimal) return;
        
        e.preventDefault();
        const touch = e.changedTouches[0];
        
        animal.classList.remove('dragging');
        
        // Handle drop - check if we're near a drop zone
        const dropZone = this.findNearestDropZone(touch.clientX, touch.clientY);
        if (dropZone) {
            this.handleDrop(dropZone.dataset.continent, animal);
        } else {
            // Show encouraging message
            this.showEncouragingMessage();
        }
        
        // Clean up drag effects
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
        
        this.draggedAnimal = null;
    }

    // Helper function to find nearest drop zone within a reasonable distance
    findNearestDropZone(x, y) {
        const dropZones = document.querySelectorAll('.drop-zone');
        let nearestZone = null;
        let nearestDistance = Infinity;
        const maxDistance = 100; // pixels - how close they need to be
        
        dropZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );
            
            if (distance < nearestDistance && distance < maxDistance) {
                nearestDistance = distance;
                nearestZone = zone;
            }
        });
        
        return nearestZone;
    }

    // Show encouraging message when animal is dropped in wrong area
    showEncouragingMessage() {
        const messages = [
            "🌟 Great try! Drag the animal closer to its home!",
            "🐾 You're doing amazing! Try dragging to the map!",
            "💪 Keep going! The animals are counting on you!",
            "🎯 So close! Try dropping on the continent!",
            "🌍 You've got this! Drag to where the animal lives!"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showMessage(message, '#4CAF50');
    }

    // Enhanced message display function
    showMessage(text, color = '#FFE4B5') {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: #333;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 1000;
            border: 3px solid #DEB887;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            animation: messageSlide 0.3s ease-out;
        `;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.animation = 'messageSlide 0.3s ease-out reverse';
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }

    resetGame() {
        // Reset all animals
        document.querySelectorAll('.animal-card').forEach(animal => {
            animal.classList.remove('placed');
        });
        
        // Reset game state
        this.placedAnimals.clear();
        this.successMessage.classList.remove('show');
        
        // Remove any remaining visual effects
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
        
        console.log('🔄 Game reset! Ready to play again!');
    }
}

// Add CSS for shake animation, confetti, and message animations
const additionalStyles = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes messageSlide {
    from {
        transform: translateX(-50%) translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the game when the page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new AnimalGeographyGame();
    console.log('🎮 Animal Geography Game loaded! Drag animals to their homes!');
});

// Make resetGame available globally for the success message button
function resetGame() {
    if (game) {
        game.resetGame();
    }
}

// Add some encouraging console messages
console.log('🌍 Welcome to the World Animals Geography Game!');
console.log('🐾 Help the animals find their homes by dragging them to the right places on the map!');
console.log('📱 This game works on both desktop and mobile devices!');
