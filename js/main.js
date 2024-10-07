const canvas = document.getElementById('canvas');
const player = document.getElementById('player');
const lifeboat = document.getElementById('lifeboat');
const island = document.getElementById('island');
const ctx = canvas.getContext('2d');

let waves = [];

// Mängija liikumismuutujad
let isMoving = { left: false, right: false, up: false, down: false };
let speed = 5; // Mängija liikumiskiirus

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

let lifeboatPosition = { x: canvas.width / 3, y: canvas.height / 2 };

// Funktsioon mängija liigutamiseks klaviatuuriga
const movePlayerWithKeyboard = () => {
    let newX = parseFloat(player.style.left || 120);
    let newY = parseFloat(player.style.top || 120);

    // Liigume vastavalt klahvidele
    if (isMoving.left) {
        newX -= speed;
        player.style.transform = `rotate(-90deg)`;  // Vasakule
    }
    if (isMoving.right) {
        newX += speed;
        player.style.transform = `rotate(90deg)`;   // Paremale
    }
    if (isMoving.up) {
        newY -= speed;
        player.style.transform = `rotate(0deg)`;    // Üles
    }
    if (isMoving.down) {
        newY += speed;
        player.style.transform = `rotate(180deg)`;  // Alla
    }

    // Piirid canvase sees
    if (newX < 0) newX = 0;
    if (newX + player.width > canvas.width) newX = canvas.width - player.width;
    if (newY < 0) newY = 0;
    if (newY + player.height > canvas.height) newY = canvas.height - player.height;

    // Asetame mängija uude asukohta
    player.style.left = `${newX}px`;
    player.style.top = `${newY}px`;

    // Loome laine liikumisel
    createWave(newX + player.width / 5, newY + player.height / 5);
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
        lifeboat.style.transform = `rotate(${angle - 90}deg)`;
    }

    // Kontrollime, et paat ei läheks väljapoole canvas't
    if (lifeboatPosition.x < 100) lifeboatPosition.x = 100;
    if (lifeboatPosition.x + lifeboat.width > canvas.width) lifeboatPosition.x = canvas.width - lifeboat.width;
    if (lifeboatPosition.y < 100) lifeboatPosition.y = 100;
    if (lifeboatPosition.y + lifeboat.height > canvas.height) lifeboatPosition.y = canvas.height - lifeboat.height;

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
      alert('Sa jõudsid saarele!');
      lifeboatPosition = { x: canvas.width / 2, y: canvas.height - 30 };
  }
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
    drawWaves(); // Kutsume funktsiooni, mis joonistab lained
    updateWaves(); // Uuendame laineid
    updateLifeboatPosition(); // Uuendame paadi asukohta
    movePlayerWithKeyboard(); // Mängija liigutamine klaviatuuri abil
};


// Mängu põhitsükkel
const gameLoop = () => {
  draw(); // Joonista kõik asjad iga kaadriga
  requestAnimationFrame(gameLoop); // Kutsu gameLoop uuesti
};

// Algatame mängu põhitsükli
gameLoop();
