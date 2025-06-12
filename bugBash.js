const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScore = document.getElementById('finalScore');

const bugEmoji = '🐛';
const splatEmoji = '💥';
const numHoles = 12;
let score = 0;
let timeLeft = 30;
let gameInterval;
let bugTimers = [];
let gameOver = false;

// Define bug types
const bugTypes = [
  { color: 'green', points: 100 },
  { color: 'blue', points: 50 },
  { color: 'red', points: 200 }
];

// Create holes
for (let i = 0; i < numHoles; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    hole.dataset.index = i;
    grid.appendChild(hole);
}

function spawnBug() {
    if (gameOver) return;

    const holes = document.querySelectorAll('.hole');
    const availableHoles = [...holes].filter(h => !h.classList.contains('active'));

    if (availableHoles.length === 0) return;

    const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    const bugType = getRandomBugType();

    randomHole.classList.add('active');
    randomHole.innerHTML = `<span class="bug ${bugType.color}" data-points="${bugType.points}">${bugEmoji}</span>`;

    const bug = randomHole.querySelector('.bug');

    bug.addEventListener('click', () => {
        if (gameOver || !randomHole.classList.contains('active')) return;

        score += parseInt(bug.dataset.points);
        scoreDisplay.textContent = `Score: ${score}`;

        bug.textContent = splatEmoji;
        bug.classList.add('squashed');

        setTimeout(() => {
            randomHole.innerHTML = '';
            randomHole.classList.remove('active');
        }, 500);
    });

    // Remove the bug after 1.5 seconds if not squashed
    const timerId = setTimeout(() => {
        if (randomHole.classList.contains('active')) {
            randomHole.innerHTML = '';
            randomHole.classList.remove('active');
        }
    }, 1500);

    bugTimers.push(timerId);
}

function getRandomBugType() {
  const rand = Math.random();
  if (rand < 0.25) {
    return { color: 'green', points: 100 };
  } else if (rand < 0.90) { // 0.25 + 0.65 = 0.90
    return { color: 'blue', points: 50 };
  } else {
    return { color: 'red', points: 200 };
  }
}

function createBug(hole) {
  const bugType = getRandomBugType();
  const bug = document.createElement('div');
  bug.classList.add('bug', bugType.color);
  bug.dataset.points = bugType.points;
  bug.addEventListener('click', function (e) {
    e.stopPropagation();
    updateScore(parseInt(bug.dataset.points));
    bug.remove();
  });
  hole.appendChild(bug);
}

// Update your game logic to use createBug when spawning bugs

// Example score update function
function updateScore(points) {
  score += points;
  document.getElementById('score').textContent = `Score: ${score}`;
}

function startGame() {
    gameInterval = setInterval(() => {
    spawnBug();
    }, 800);

    const countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱ 0:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(countdown);
        bugTimers.forEach(clearTimeout);
        endGame();
    }
    }, 1000);
}

function endGame() {
    gameOver = true;
    const holes = document.querySelectorAll('.hole');
    holes.forEach(hole => {
    hole.innerHTML = '';
    hole.classList.remove('active');
    });
    finalScore.textContent = score;
    gameOverMessage.classList.remove('hidden');
}

startGame();