const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Funktsioon kanvase suuruse seadmiseks
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Kutsume funktsiooni, mis hakkab joonistama
  draw();
}

// Näide, kuidas kanvasele joonistada
function draw() {
  // Võid siia lisada oma joonistuse loogika, nt lained või muud animatsioonid.
  context.clearRect(0, 0, canvas.width, canvas.height); // Eemalda eelnev joonistus
  
  // Lihtne näide: joonistame ruudu
  context.fillStyle = 'rgba(255, 255, 255, 0.5)';
  context.fillRect(50, 50, 100, 100);
}

// Kui akna suurus muutub, muudame canvase suurust ja joonistame uuesti
window.addEventListener('resize', resizeCanvas);

// Esialgse canvase suuruse seadmine ja joonistamine
resizeCanvas();
