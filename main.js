const intro = document.getElementById('letsPlay');
const canvas = document.getElementById('canvas');
const player = document.getElementById('player');
const lifeboat = document.getElementById('lifeboat');
const island = document.getElementById('island');
const timeLeft = document.getElementsByClassName('timeLeft');
const pointsBox = document.getElementsByClassName('pointsBox');
const questionOneIcon = document.getElementById('questionOneIcon');
const questionTwoIcon = document.getElementById('questionTwoIcon');
const questionContainers = document.getElementsByClassName('questionContainer');
const yesOne = document.getElementById('yesOne');
const noOne = document.getElementById('noOne');
const yesTwo = document.getElementById('yesTwo');
const noTwo = document.getElementById('noTwo');
const ctx = canvas.getContext('2d');

let waves = [];
let isMoving = { left: false, right: false, up: false, down: false };
let speed = 5;
let points = 0;
let time = 120;
let timerInterval;
let questionOneAnswered = false;
let questionTwoAnswered = false;

// mängima asumisel, eemalda intro leht
document.getElementById('play').addEventListener('click', () => {
  intro.style.top = '-1000px';

  // Käivitame taimeri
  timerInterval = setInterval(updateTimer, 1000);
});

// Taimeri käivitamine
const updateTimer = () => {
  if (time > 0) {
      time--;
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      document.getElementById('time').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  } else {
      clearInterval(timerInterval); // Peatame taimeri, kui aeg otsas
      alert('Aeg on läbi!');
      resetGame();
  }
};

// Punktide uuendamine
const updatePoints = (newPoints) => {
  points += newPoints;
  document.getElementById('points').textContent = points;
};

// Suuruse kohandamine
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Määrame piltide suurused
    player.width = 70; // Mängija laius
    player.height = 80; // Mängija kõrgus
    lifeboat.width = 70; // Paadi laius
    lifeboat.height = 100; // Paadi kõrgus
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Paadi asukoha uuendamine
let lifeboatPosition = { x: canvas.width / 3, y: canvas.height / 2 };

// Kontrolli küsimuste kokkupõrget
const checkQuestionCollision = () => {
  const lifeboatRect = lifeboat.getBoundingClientRect();
  const questionOneRect = questionOneIcon.getBoundingClientRect();
  const questionTwoRect = questionTwoIcon.getBoundingClientRect();

  // Kui paat puutub esimese küsimusega
  if (!questionOneAnswered && lifeboatRect.x < questionOneRect.x + questionOneRect.width &&
      lifeboatRect.x + lifeboatRect.width > questionOneRect.x &&
      lifeboatRect.y < questionOneRect.y + questionOneRect.height &&
      lifeboatRect.y + lifeboatRect.height > questionOneRect.y) {
      showQuestion(0); // Näita esimest küsimust
  }

  // Kui paat puutub teise küsimusega
  if (!questionTwoAnswered && lifeboatRect.x < questionTwoRect.x + questionTwoRect.width &&
      lifeboatRect.x + lifeboatRect.width > questionTwoRect.x &&
      lifeboatRect.y < questionTwoRect.y + questionTwoRect.height &&
      lifeboatRect.y + lifeboatRect.height > questionTwoRect.y) {
      showQuestion(1); // Näita teist küsimust
  }
};

// Näita küsimuse konteinerit
const showQuestion = (questionIndex) => {
  questionContainers[questionIndex].style.display = 'flex';
};

// Peida küsimuse konteiner
const hideQuestion = (questionIndex) => {
  questionContainers[questionIndex].style.display = 'none';
};

// Kontrolli esimese küsimuse vastust
yesOne.addEventListener('click', () => {
  handleAnswer(0, true); // Õige vastus (Jah)
});
noOne.addEventListener('click', () => {
  handleAnswer(0, false); // Vale vastus (Ei)
});

// Kontrolli teise küsimuse vastust
yesTwo.addEventListener('click', () => {
  handleAnswer(1, false); // Vale vastus (Jah)
});
noTwo.addEventListener('click', () => {
  handleAnswer(1, true); // Õige vastus (Ei)
});

// Töötle vastust ja uuenda punkte
const handleAnswer = (questionIndex, isCorrect) => {
  if (isCorrect) {
      alert('Õige vastus! Teenisid 500 punkti!');
      updatePoints(500); // Lisa punkte
  } else {
      alert('Vale vastus! Vale vastus maksab 500 punkti!');
      updatePoints(-500); // Lahuta punkte
  }

  hideQuestion(questionIndex);

  // Märgi küsimus vastatuks
  if (questionIndex === 0) questionOneAnswered = true;
  if (questionIndex === 1) questionTwoAnswered = true;
};

// Funktsioon mängija liigutamiseks klaviatuuriga
const movePlayerWithKeyboard = () => {
    let newX = parseFloat(player.style.left || 150);
    let newY = parseFloat(player.style.top || 150);

    // Liigume vastavalt klahvidele
    if (isMoving.left) {
        newX -= speed;
        player.style.transform = 'rotate(-90deg)';  // Vasakule
    }
    if (isMoving.right) {
        newX += speed;
        player.style.transform = 'rotate(90deg)';   // Paremale
    }
    if (isMoving.up) {
        newY -= speed;
        player.style.transform = 'rotate(0deg)';    // Üles
    }
    if (isMoving.down) {
        newY += speed;
        player.style.transform = 'rotate(180deg)';  // Alla
    }

    // Piirid canvase sees
    if (newX < 0) newX = 0;
    if (newX + player.width > canvas.width) newX = canvas.width - player.width;
    if (newY < 0) newY = 0;
    if (newY + player.height > canvas.height) newY = canvas.height - player.height;

    // Asetame mängija uude asukohta
    player.style.left = newX + 'px';
    player.style.top = newY + 'px';

    // Loome laine liikumisel
    createWave(newX + player.width / 2, newY + player.height / 2);
};

// Klaviatuuri sündmused liikumiseks
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') isMoving.left = true;
    if (e.key === 'ArrowRight') isMoving.right = true;
    if (e.key === 'ArrowUp') isMoving.up = true;
    if (e.key === 'ArrowDown') isMoving.down = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') isMoving.left = false;
    if (e.key === 'ArrowRight') isMoving.right = false;
    if (e.key === 'ArrowUp') isMoving.up = false;
    if (e.key === 'ArrowDown') isMoving.down = false;
});

// Lainete loomise funktsioon
const createWave = (x, y) => {
    waves.push({ x: x, y: y, radius: 0, maxRadius: 120 });
};

// Lainete uuendamine
const updateWaves = () => {
    for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].radius += 2;
        if (waves[i].radius > waves[i].maxRadius) {
            waves.splice(i, 1); // Eemaldame laine, kui see saavutab maksimaalse suuruse
        } else {
            const distance = Math.hypot(lifeboatPosition.x - waves[i].x, lifeboatPosition.y - waves[i].y);
            if (distance < waves[i].radius) {
                lifeboatPosition.x += (waves[i].x - lifeboatPosition.x) * 0.05;
                lifeboatPosition.y -= (waves[i].y - lifeboatPosition.y) * 0.05;
            }
        }
    }
};

// Paadi asukoha uuendamine
const updateLifeboatPosition = () => {
    const lifeboatRect = lifeboat.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    const dx = playerRect.left + playerRect.width / 2 - (lifeboatRect.left + lifeboatRect.width / 2);
    const dy = playerRect.top + playerRect.height / 2 - (lifeboatRect.top + lifeboatRect.height / 2);
    const distance = Math.hypot(dx, dy);
    const playerBoatDistance = 120; // 50px kaugus mängijast

    if (distance < playerBoatDistance) {
        // Muudame suunda: paat liigub mängijast eemale
        lifeboatPosition.x -= (dx / distance) * 5;
        lifeboatPosition.y -= (dy / distance) * 5;

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        lifeboat.style.transform = 'rotate(' + (angle - 90) + 'deg)';
    }

    const margin = 30;

    if (lifeboatPosition.x < margin) lifeboatPosition.x = margin;
    if (lifeboatPosition.x + lifeboat.width > canvas.width - margin) lifeboatPosition.x = canvas.width - lifeboat.width - margin;
    if (lifeboatPosition.y < margin) lifeboatPosition.y = margin;
    if (lifeboatPosition.y + lifeboat.height > canvas.height - margin) lifeboatPosition.y = canvas.height - lifeboat.height - margin;

    lifeboat.style.left = `${lifeboatPosition.x}px`;
    lifeboat.style.top = `${lifeboatPosition.y}px`;

    checkWinCondition();
};

// Võidu tingimuste kontroll
const checkWinCondition = () => {
    const islandRect = island.getBoundingClientRect();
    const lifeboatRect = lifeboat.getBoundingClientRect();

    const padding = 50;

    if (
      lifeboatRect.x < islandRect.x + islandRect.width - padding &&
      lifeboatRect.x + lifeboatRect.width > islandRect.x + padding &&
      lifeboatRect.y < islandRect.y + islandRect.height - padding &&
      lifeboatRect.y + lifeboatRect.height > islandRect.y + padding
  ) {
      clearInterval(timerInterval); // Peatame taimeri, kui mängija jõuab saarele
      
      updatePoints(1000);
      alert(`Sa jõudsid saarele! Sinu lõpp-punktid on: ${points} punkti!`);
      
      resetGame();
  }
};

// Mängu taaskäivitamine
const resetGame = () => {
  time = 120;
  points = 0;
  updatePoints(0);
  document.getElementById('time').textContent = '2:00';  

  // Taastame mängija algse asukoha
  player.style.left = '150px';
  player.style.top = '150px';
  player.style.transform = 'rotate(0deg)';  // Mängija algne suund

  // Taastame paadi algse asukoha
  lifeboatPosition = { x: canvas.width / 3, y: canvas.height / 2 };
  lifeboat.style.left = `${lifeboatPosition.x}px`;
  lifeboat.style.top = `${lifeboatPosition.y}px`;

  intro.style.top = 0;

  questionOneAnswered = false;
  questionTwoAnswered = false;
  document.querySelectorAll('.questionContainer').forEach(q => q.style.display = 'none');

  // Tühjendame lainete massiivi
  waves = [];
  speed = 5;
  isMoving = { left: false, right: false, up: false, down: false };
};


// Lainete joonistamine
const drawWaves = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Kustuta eelmine joonistus
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;

    for (const wave of waves) {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
};

// Peamine joonistamise funktsioon
const draw = () => {
    drawWaves();
    updateWaves();
    updateLifeboatPosition();
    movePlayerWithKeyboard();
};


// Mängu põhitsükkel
const gameLoop = () => {
  draw(); // Joonista kõik asjad iga kaadriga
  checkQuestionCollision(); // Kontrolli küsimuste kokk
  requestAnimationFrame(gameLoop); // Kutsu gameLoop uuesti
};

resetGame();
gameLoop();