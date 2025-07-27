Coding Plan for “Petal Puzzles – Simple Addition Edition”

---

🎯 Goal

Create a lightweight, browser-based game where children practice simple addition by planting petals on digital flowers, plus a bonus Bee Match mode where they match bees to the correct flower sums.

---

🏗 Tech Stack

| Layer | Tools |
|--------------|--------------------------------|
| Frontend | HTML5, CSS3, JavaScript |
| Framework | Optional: React or Vanilla JS |
| Backend | Firebase (for saving progress) |
| Animation | CSS transitions or GSAP |
| Hosting | Netlify or GitHub Pages |

---

🎮 Core Modules & Features

| Module | Functionality |
|-------------------|-------------------------------------------------------------------------------|
| Flower Canvas | Display empty flowers with numbered petal slots |
| Addition Puzzle | Generate random sums (e.g., 2 + 3, 5 + 1) |
| Petal Drag & Drop | Allow kids to drag numbered petals onto a flower |
| Bee Match Mode | Display bees labeled with answers and flowers showing sums; drag bee to match |
| Score Tracker | Tally correct answers and show stars or sunlight |
| Sound & Effects | Play chimes for correct answers, gentle buzz for drag |

---

📂 Folder Structure

`plaintext
/flower-addition-game
├── /src
│ ├── /components
│ │ ├── FlowerCanvas.js
│ │ ├── PetalItem.js
│ │ ├── AdditionPuzzle.js
│ │ ├── BeeMatchMode.js
│ │ ├── ScoreDisplay.js
│ ├── /assets
│ │ ├── images/
│ │ ├── sounds/
│ └── App.js
├── /public
│ └── index.html
└── package.json
`

---

🔄 Game Logic Highlights

- On load, start in Addition Mode or allow mode selection.
- Addition Mode  
  - Display one flower with two empty petal slots labeled “?” and “?”.  
  - Generate two numbers between 1 and 5.  
  - Player drags numbered petals into slots.  
  - Correct sum blooms the flower and updates score.  

- Bee Match Mode  
  - Show a field of 3–5 flowers, each displaying a sum (e.g., 4 + 2).  
  - Present bees in a side panel, each labeled with an answer (e.g., 6).  
  - Player drags a bee onto the matching flower.  
  - Correct match triggers flower bloom, bee collects a honey star, and score increments.  

---

🎨 Visual & Interaction Notes

- Bright, cartoon-style artwork for flowers and bees.  
- Large draggable elements sized for little fingers.  
- Smooth animations: petals pop into place, bees fly to flowers.  
- Positive feedback: glowing petals, honey star rewards, cheerful chime sounds.  
- Mode switch UI with friendly icons for addition and bee match.  

---
