const doors = document.querySelectorAll(".door");
const instruction = document.getElementById("instruction");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");
const modeSwitch = document.getElementById("modeSwitch");

let carPosition;
let selectedDoor = null;
let revealedDoor = null;
let gameEnded = false;
let mode = "classic"; // "classic" ou "no-repeat"
let lastCarPosition = null;

function initGame() {
  gameEnded = false;
  selectedDoor = null;
  revealedDoor = null;

  doors.forEach(door => {
    door.classList.remove("active", "revealed", "winner");
    door.innerHTML = `<img src="imagens/porta.png" alt="Porta">`;
  });

  message.style.display = "none";   // <-- oculta no início
  message.textContent = "";
  instruction.textContent = "Escolha uma porta clicando nela!";
  restartButton.style.display = "none";

  // Definir posição do carro
  if (mode === "classic") {
    carPosition = Math.floor(Math.random() * 3);
  } else {
    do {
      carPosition = Math.floor(Math.random() * 3);
    } while (carPosition === lastCarPosition);
    lastCarPosition = carPosition;
  }
}

function revealGoatDoor() {
  const possibleDoors = [0, 1, 2].filter(
    d => d !== carPosition && d !== selectedDoor
  );
  revealedDoor = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

  const door = doors[revealedDoor];
  door.classList.add("revealed");
  door.innerHTML = `<img src="imagens/cabra.png" alt="Cabra">`;

  // encontrar a outra porta que sobrou
  const otherDoor = [0, 1, 2].find(
    d => d !== selectedDoor && d !== revealedDoor
  );

  instruction.textContent = `Você quer manter a sua escolha na Porta ${selectedDoor + 1}, ou trocar para a Porta ${otherDoor + 1}?`;
}

function endGame(finalChoice) {
  gameEnded = true;

  doors.forEach((door, index) => {
    door.classList.remove("active", "winner", "revealed");

    if (index === carPosition) {
      door.classList.add("winner"); // verde
      door.innerHTML = `<img src="imagens/carro.png" alt="Carro">`;
    } else {
      door.classList.add("revealed"); // vermelho
      door.innerHTML = `<img src="imagens/cabra.png" alt="Cabra">`;
    }
  });

  if (finalChoice === carPosition) {
    message.textContent = "Você ganhou o carro!";
    playAudio("sons/silvio.mp3");
  } else {
    message.textContent = "Você ficou com a cabra!";
    playAudio("sons/faustao.mp3");
  }

  message.style.display = "inline-block";  // <-- mostra só no final
  restartButton.style.display = "inline-block";
}

function playAudio(src) {
  const audio = new Audio(src);
  audio.play();
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 3000); 
}

doors.forEach((door, index) => {
  door.addEventListener("click", () => {
    if (gameEnded) return;

    if (selectedDoor === null) {
      selectedDoor = index;
      instruction.textContent = `Você escolheu a Porta ${index + 1}. Aguarde...`;
      revealGoatDoor();
    } else if (index !== revealedDoor) {
      endGame(index);
    }
  });
});

restartButton.addEventListener("click", initGame);

modeSwitch.addEventListener("click", () => {
  mode = mode === "classic" ? "no-repeat" : "classic";
  modeSwitch.textContent =
    mode === "classic"
      ? "Modo: CLÁSSICO (aleatório)"
      : "Modo: NÃO REPETE (sem repetição)";
  initGame();
});

initGame();
