class PlanetExplorer {
    constructor() {
        this.currentTab = 'create-game';
        this.factsGame = null;
        this.createGame = null;
        
        this.initializeTabs();
        this.factsGame = new PlanetFactsGame();
        this.createGame = new CreateSolarSystemGame();
    }

    initializeTabs() {
        const tabs = document.querySelectorAll('.tab');
        const gameContainers = document.querySelectorAll('.game-tab');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding game
                gameContainers.forEach(container => {
                    container.classList.remove('active');
                });
                
                document.getElementById(targetTab).classList.add('active');
                this.currentTab = targetTab;
                
                // Reset games when switching tabs
                if (targetTab === 'facts-game' && this.factsGame) {
                    // Keep facts game as is, don't auto-reset
                } else if (targetTab === 'create-game' && this.createGame) {
                    // Keep create game as is, don't auto-reset
                }
            });
        });
    }
}

class PlanetFactsGame {
    constructor() {
        this.totalFacts = 9;
        this.placedFacts = 0;
        this.draggedElement = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.messageElement = document.getElementById('message');
        this.resetButton = document.getElementById('reset-btn');
        this.celebrationDialog = document.getElementById('celebration-dialog');
        this.playAgainButton = document.getElementById('play-again-btn');
        
        // Get all draggable fact cards
        this.factCards = document.querySelectorAll('.fact-card');
        this.dropZones = document.querySelectorAll('.drop-zone');
        
        this.shuffleFacts();
    }

    setupEventListeners() {
        // Drag and drop for fact cards
        this.factCards.forEach(card => {
            card.addEventListener('dragstart', (e) => this.handleDragStart(e));
            card.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        // Drop zone events
        this.dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
        });

        // Reset button
        this.resetButton.addEventListener('click', () => this.resetGame());

        // Play again button
        this.playAgainButton.addEventListener('click', () => {
            this.celebrationDialog.classList.add('hidden');
            this.resetGame();
        });

        // Touch events for mobile support
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let touchStartX, touchStartY;
        let isDragging = false;
        let dragElement = null;
        let ghostElement = null;

        this.factCards.forEach(card => {
            // Prevent default touch behaviors that might interfere
            card.addEventListener('touchstart', (e) => {
                if (card.classList.contains('placed')) return;
                
                isDragging = true;
                dragElement = card;
                
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                // Create a visual feedback
                card.classList.add('dragging');
                card.style.zIndex = '1000';
                
                // Prevent scrolling while dragging
                e.preventDefault();
            }, { passive: false });

            card.addEventListener('touchmove', (e) => {
                if (!isDragging || !dragElement) return;
                
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                
                // Apply transform for visual feedback
                dragElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.9)`;
                
                // Highlight drop zones on hover
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                this.dropZones.forEach(zone => zone.classList.remove('drag-over'));
                if (elementBelow && elementBelow.classList.contains('drop-zone')) {
                    elementBelow.classList.add('drag-over');
                }
                
                e.preventDefault();
            }, { passive: false });

            card.addEventListener('touchend', (e) => {
                if (!isDragging || !dragElement) return;
                
                const touch = e.changedTouches[0];
                const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                
                // Clear all drag-over states
                this.dropZones.forEach(zone => zone.classList.remove('drag-over'));
                
                if (dropTarget && dropTarget.classList.contains('drop-zone')) {
                    this.handleTouchDrop(dragElement, dropTarget);
                }
                
                // Reset visual state
                dragElement.style.transform = '';
                dragElement.style.zIndex = '';
                dragElement.classList.remove('dragging');
                isDragging = false;
                dragElement = null;
            }, { passive: false });
        });
    }

    handleTouchDrop(factCard, dropZone) {
        const factAnswer = factCard.dataset.answer;
        const zonePlanet = dropZone.dataset.planet;
        
        if (factAnswer === zonePlanet && !dropZone.hasChildNodes()) {
            this.placeFact(factCard, dropZone);
        } else {
            this.showMessage('Try again! 🤔', 'error');
        }
    }

    shuffleFacts() {
        const factsContainer = document.querySelector('.facts-grid');
        const facts = Array.from(this.factCards);
        
        // Fisher-Yates shuffle
        for (let i = facts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [facts[i], facts[j]] = [facts[j], facts[i]];
        }
        
        // Re-append in shuffled order
        facts.forEach(fact => factsContainer.appendChild(fact));
    }

    handleDragStart(e) {
        if (e.target.classList.contains('placed')) {
            e.preventDefault();
            return;
        }
        
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('drop-zone') && !e.target.hasChildNodes()) {
            e.target.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('drop-zone')) {
            e.target.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const dropZone = e.target;
        
        if (!dropZone.classList.contains('drop-zone') || dropZone.hasChildNodes()) {
            return;
        }
        
        dropZone.classList.remove('drag-over');
        
        if (!this.draggedElement) return;
        
        const factAnswer = this.draggedElement.dataset.answer;
        const zonePlanet = dropZone.dataset.planet;
        
        if (factAnswer === zonePlanet) {
            this.placeFact(this.draggedElement, dropZone);
        } else {
            this.showMessage('Not quite right! Try again! 🤔', 'error');
            this.animateWrongDrop(this.draggedElement);
        }
    }

    placeFact(factCard, dropZone) {
        // Clone the fact card and place it in the drop zone
        const factClone = factCard.cloneNode(true);
        factClone.classList.add('placed');
        factClone.draggable = false;
        
        // Remove original fact card
        factCard.remove();
        
        // Add to drop zone
        dropZone.appendChild(factClone);
        
        // Update game state
        this.placedFacts++;
        
        // Show success message
        this.showMessage('Great job! 🌟', 'success');
        
        // Check if game is complete
        if (this.placedFacts === this.totalFacts) {
            setTimeout(() => {
                this.showCelebrationDialog();
            }, 1000);
        }
    }

    animateWrongDrop(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    showMessage(text, type = '') {
        this.messageElement.textContent = text;
        this.messageElement.className = `message ${type}`;
        
        if (type) {
            setTimeout(() => {
                this.messageElement.className = 'message';
                if (this.placedFacts < this.totalFacts) {
                    this.messageElement.textContent = 'Drag the facts to the correct planets!';
                }
            }, 2000);
        }
    }

    showCelebrationDialog() {
        this.celebrationDialog.classList.remove('hidden');
        this.createConfetti();
    }

    createConfetti() {
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                z-index: 1000;
                pointer-events: none;
                border-radius: 50%;
            `;
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }

    resetGame() {
        // Reset game state
        this.placedFacts = 0;
        
        // Hide celebration dialog
        this.celebrationDialog.classList.add('hidden');
        
        // Clear all drop zones
        this.dropZones.forEach(zone => {
            zone.innerHTML = '';
            zone.classList.remove('drag-over');
        });
        
        // Recreate fact cards in the facts container
        const factsGrid = document.querySelector('.facts-grid');
        factsGrid.innerHTML = '';
        
        const facts = [
            { fact: 'hottest', answer: 'venus', icon: '🔥', text: 'Hottest Planet' },
            { fact: 'smallest', answer: 'mercury', icon: '🤏', text: 'Smallest Planet' },
            { fact: 'biggest', answer: 'jupiter', icon: '🌟', text: 'Biggest Planet' },
            { fact: 'most-moons', answer: 'saturn', icon: '🌙', text: 'Most Moons' },
            { fact: 'our-home', answer: 'earth', icon: '🏠', text: 'Our Home Planet' },
            { fact: 'red-planet', answer: 'mars', icon: '🔴', text: 'The Red Planet' },
            { fact: 'rings', answer: 'saturn', icon: '💍', text: 'Beautiful Rings' },
            { fact: 'farthest', answer: 'neptune', icon: '🌊', text: 'Farthest from Sun' },
            { fact: 'sideways', answer: 'uranus', icon: '🔄', text: 'Rolls on Its Side' }
        ];
        
        facts.forEach(factData => {
            const factCard = document.createElement('div');
            factCard.className = 'fact-card';
            factCard.draggable = true;
            factCard.dataset.fact = factData.fact;
            factCard.dataset.answer = factData.answer;
            
            factCard.innerHTML = `
                <span class="fact-icon">${factData.icon}</span>
                <span class="fact-text">${factData.text}</span>
            `;
            
            factsGrid.appendChild(factCard);
        });
        
        // Reinitialize
        this.initializeGame();
        this.setupEventListeners();
        this.showMessage('Game reset! Drag the facts to the correct planets!');
    }
}

// Fun facts about planets that appear occasionally
const planetFacts = {
    mercury: "Mercury is so close to the Sun that a year there is only 88 Earth days!",
    venus: "Venus spins backwards compared to most planets!",
    earth: "Earth is the only planet we know that has life!",
    mars: "Mars has the largest volcano in our solar system!",
    jupiter: "Jupiter is so big that all other planets could fit inside it!",
    saturn: "Saturn would float in water because it's less dense!",
    uranus: "Uranus rolls on its side as it orbits the Sun!",
    neptune: "Neptune has winds that blow at over 1,200 miles per hour!"
};

// Show random fun facts
function showRandomFact() {
    const planets = Object.keys(planetFacts);
    const randomPlanet = planets[Math.floor(Math.random() * planets.length)];
    const fact = planetFacts[randomPlanet];
    
    // Create a temporary tooltip
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 215, 0, 0.9);
        color: #333;
        padding: 15px;
        border-radius: 10px;
        max-width: 300px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        font-family: 'Comic Neue', cursive;
        font-weight: bold;
    `;
    tooltip.textContent = `💡 Fun Fact: ${fact}`;
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
        tooltip.remove();
    }, 5000);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PlanetExplorer();
    
    // Show fun facts every 30 seconds
    setInterval(showRandomFact, 30000);
    
    // Show first fun fact after 10 seconds
    setTimeout(showRandomFact, 10000);
});

class CreateSolarSystemGame {
    constructor() {
        this.placedPlanets = new Set();
        this.draggedElement = null;
        
        this.initializeCreateGame();
        this.setupCreateEventListeners();
    }

    initializeCreateGame() {
        this.createMessageElement = document.getElementById('create-message');
        this.clearSystemButton = document.getElementById('clear-system-btn');
        this.planetButtons = document.querySelectorAll('.planet-button');
        this.orbitZones = document.querySelectorAll('.orbit-zone');
        this.celebrationDialog = document.getElementById('create-celebration-dialog');
        this.buildAgainButton = document.getElementById('build-again-btn');
    }

    setupCreateEventListeners() {
        // Planet button drag events
        this.planetButtons.forEach(button => {
            button.addEventListener('dragstart', (e) => this.handlePlanetDragStart(e));
            button.addEventListener('dragend', (e) => this.handlePlanetDragEnd(e));
        });

        // Orbit zone events
        this.orbitZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handlePlanetDrop(e));
        });

        // Clear system button
        this.clearSystemButton.addEventListener('click', () => this.clearSolarSystem());

        // Build again button
        this.buildAgainButton.addEventListener('click', () => this.clearSolarSystem());

        // Touch events for mobile
        this.setupCreateTouchEvents();
    }

    findClosestOrbitZone(touchX, touchY) {
        let closestZone = null;
        let minDistance = Infinity;
        const fuzzyThreshold = 150; // Increased pixels - more generous fuzzy area
        
        this.orbitZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate distance from touch point to center of orbit zone
            const distance = Math.sqrt(
                Math.pow(touchX - centerX, 2) + Math.pow(touchY - centerY, 2)
            );
            
            // Also check if touch point is within the expanded zone boundary
            const expandedRadius = Math.max(rect.width, rect.height) / 2 + 50; // Add 50px buffer
            const withinExpandedZone = distance <= expandedRadius;
            
            // Check if this zone is closer and within the fuzzy threshold or expanded zone
            if (distance < minDistance && (distance <= fuzzyThreshold || withinExpandedZone)) {
                minDistance = distance;
                closestZone = zone;
            }
        });
        
        return closestZone;
    }

    // Enhanced touchmove with fuzzy highlighting
    setupCreateTouchEvents() {
        let touchStartX, touchStartY;
        let isDragging = false;
        let dragElement = null;

        this.planetButtons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                if (button.classList.contains('used')) return;
                
                isDragging = true;
                dragElement = button;
                
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                // Visual feedback for touch
                button.style.opacity = '0.7';
                button.style.zIndex = '1000';
                button.classList.add('dragging');
                
                // Prevent scrolling while dragging
                e.preventDefault();
            }, { passive: false });

            button.addEventListener('touchmove', (e) => {
                if (!isDragging || !dragElement) return;
                
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                
                dragElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.9)`;
                
                // Clear previous highlights
                this.orbitZones.forEach(zone => zone.classList.remove('drag-over'));
                
                // Use fuzzy detection to highlight the closest zone
                const closestZone = this.findClosestOrbitZone(touch.clientX, touch.clientY);
                if (closestZone && !closestZone.hasChildNodes()) {
                    closestZone.classList.add('drag-over');
                }
                
                e.preventDefault();
            }, { passive: false });

            button.addEventListener('touchend', (e) => {
                if (!isDragging || !dragElement) return;
                
                const touch = e.changedTouches[0];
                const touchX = touch.clientX;
                const touchY = touch.clientY;
                
                // Clear all drag-over states
                this.orbitZones.forEach(zone => zone.classList.remove('drag-over'));
                
                // Find the closest orbit zone using fuzzy detection
                const closestZone = this.findClosestOrbitZone(touchX, touchY);
                
                if (closestZone) {
                    const draggedPlanetType = dragElement.dataset.planet;
                    const expectedPlanetType = closestZone.dataset.planet;
                    
                    if (draggedPlanetType === expectedPlanetType && !closestZone.hasChildNodes()) {
                        this.placePlanetInOrbit(dragElement, closestZone);
                    } else if (draggedPlanetType !== expectedPlanetType) {
                        this.showCreateMessage(`That's not the right spot for ${draggedPlanetType.charAt(0).toUpperCase() + draggedPlanetType.slice(1)}! Try the correct orbital position! 🌍`, 'error');
                    } else {
                        this.showCreateMessage('That spot is already taken! 🤔', 'error');
                    }
                } else {
                    // Check if we're at least near the drop area
                    const spaceCanvas = document.querySelector('.space-canvas');
                    const canvasRect = spaceCanvas.getBoundingClientRect();
                    if (touchX >= canvasRect.left && touchX <= canvasRect.right && 
                        touchY >= canvasRect.top && touchY <= canvasRect.bottom) {
                        this.showCreateMessage('Try dragging closer to one of the orbit paths! 🌌', 'info');
                    }
                }
                
                // Reset visual state
                dragElement.style.transform = '';
                dragElement.style.opacity = '';
                dragElement.style.zIndex = '';
                dragElement.classList.remove('dragging');
                isDragging = false;
                dragElement = null;
            }, { passive: false });
        });
    }

    handlePlanetDragStart(e) {
        if (e.target.classList.contains('used')) {
            e.preventDefault();
            return;
        }
        
        this.draggedElement = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handlePlanetDragEnd(e) {
        this.draggedElement = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('orbit-zone') && !e.target.hasChildNodes()) {
            e.target.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('orbit-zone')) {
            e.target.classList.remove('drag-over');
        }
    }

    handlePlanetDrop(e) {
        e.preventDefault();
        const dropZone = e.target;
        
        // Use fuzzy detection for mouse drops too
        const rect = e.target.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        let targetZone = dropZone;
        
        // If not dropped directly on a zone, try fuzzy detection
        if (!dropZone.classList.contains('orbit-zone')) {
            targetZone = this.findClosestOrbitZone(mouseX, mouseY);
        }
        
        if (!targetZone || !targetZone.classList.contains('orbit-zone') || targetZone.hasChildNodes()) {
            this.orbitZones.forEach(zone => zone.classList.remove('drag-over'));
            return;
        }
        
        this.orbitZones.forEach(zone => zone.classList.remove('drag-over'));
        
        if (!this.draggedElement) return;
        
        const draggedPlanetType = this.draggedElement.dataset.planet;
        const expectedPlanetType = targetZone.dataset.planet;
        
        // Check if the planet matches the correct position
        if (draggedPlanetType === expectedPlanetType) {
            this.placePlanetInOrbit(this.draggedElement, targetZone);
        } else {
            this.showCreateMessage(`That's not the right spot for ${draggedPlanetType.charAt(0).toUpperCase() + draggedPlanetType.slice(1)}! Try the correct orbital position! 🌍`, 'error');
        }
    }

    placePlanetInOrbit(planetButton, orbitZone) {
        if (orbitZone.hasChildNodes()) return;
        
        const planetType = planetButton.dataset.planet;
        
        // Create planet element for orbit
        const placedPlanet = document.createElement('div');
        placedPlanet.className = 'placed-planet';
        placedPlanet.dataset.planet = planetType;
        
        // Create image element for the planet
        const img = document.createElement('img');
        img.alt = planetType.charAt(0).toUpperCase() + planetType.slice(1);
        
        // Set the correct image source based on planet type
        switch(planetType) {
            case 'mercury':
                img.src = 'images/mercury.png?v=1735362000';
                break;
            case 'venus':
                img.src = 'images/Venus.jpg?v=1735362000';
                break;
            case 'earth':
                img.src = 'images/earth.png?v=1735362000';
                break;
            case 'mars':
                img.src = 'images/mars.png?v=1735362000';
                break;
            case 'jupiter':
                img.src = 'images/jupiter.jpg?v=1735362000';
                break;
            case 'saturn':
                img.src = 'images/saturn.jpg?v=1735362000';
                break;
            case 'uranus':
                img.src = 'images/uranus.png?v=1735362000';
                break;
            case 'neptune':
                img.src = 'images/neptune.jpg?v=1735362000';
                break;
        }
        
        placedPlanet.appendChild(img);
        
        // Add to orbit zone
        orbitZone.appendChild(placedPlanet);
        orbitZone.classList.add('filled');
        
        // Mark button as used
        planetButton.classList.add('used');
        planetButton.draggable = false;
        
        // Track placement
        this.placedPlanets.add(planetType);
        
        // Show success message
        this.showCreateMessage(`Great! You placed ${planetType.charAt(0).toUpperCase() + planetType.slice(1)}! 🌟`, 'success');
        
        // Check if solar system is complete
        if (this.placedPlanets.size === 8) {
            setTimeout(() => {
                this.showCreateMessage('🎉 Amazing! You created a complete solar system! 🎉', 'success');
                this.showCelebration();
            }, 1000);
        }
    }

    showCreateMessage(text, type = '') {
        this.createMessageElement.textContent = text;
        this.createMessageElement.className = `message ${type}`;
        
        if (type) {
            setTimeout(() => {
                this.createMessageElement.className = 'message';
                if (this.placedPlanets.size < 8) {
                    this.createMessageElement.textContent = 'Build your solar system by dragging planets!';
                }
            }, 3000);
        }
    }

    showCelebration() {
        // Add some delay for dramatic effect
        setTimeout(() => {
            this.celebrationDialog.classList.remove('hidden');
            
            // Add confetti effect
            this.createConfetti();
        }, 500);
    }

    createConfetti() {
        // Create 20 confetti pieces
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                z-index: 1000;
                border-radius: 50%;
            `;
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }

    clearSolarSystem() {
        // Hide celebration dialog
        this.celebrationDialog.classList.add('hidden');
        
        // Clear all orbit zones
        this.orbitZones.forEach(zone => {
            zone.innerHTML = '';
            zone.classList.remove('filled', 'drag-over');
        });
        
        // Reset all planet buttons
        this.planetButtons.forEach(button => {
            button.classList.remove('used');
            button.draggable = true;
        });
        
        // Reset tracking
        this.placedPlanets.clear();
        
        // Reset message
        this.showCreateMessage('Build your solar system by dragging planets!');
    }
}
