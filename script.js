const doors = document.querySelectorAll(".door");
const instruction = document.getElementById("instruction");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");
const modeSwitch = document.getElementById("modeSwitch");

let carPosition;
let selectedDoor = null;
let revealedDoor = null;
let gameEnded = false;
let mode = "classic"; // "classic", "no-repeat", "super-hard"
let lastCarPosition = null;

function initGame() {
  gameEnded = false;
  selectedDoor = null;
  revealedDoor = null;

  doors.forEach(door => {
    door.classList.remove("active", "revealed", "winner");
    door.innerHTML = `<img src="imagens/porta.png" alt="Porta">`;
  });

  message.style.display = "none";
  message.textContent = "";
  instruction.textContent = "Escolha uma porta clicando nela!";
  restartButton.style.display = "none";

  if (mode === "classic") {
    // carro definido já no início
    carPosition = Math.floor(Math.random() * 3);
    console.log(`(CLÁSSICO) Posição do carro: ${carPosition + 1}`);
  } else {
    // nos modos trapaceiros, carro ainda não definido
    carPosition = null;
    console.log(`(${mode.toUpperCase()}) Carro ainda não definido!`);
  }
}

function revealGoatDoor() {
  if (carPosition === null) {
    const outras = [0, 1, 2].filter(p => p !== selectedDoor);

    if (mode === "no-repeat") {
      // TRAPACEIRO LEVE
      const sorte = Math.random();
      if (sorte < 0.3) {
        carPosition = outras[Math.floor(Math.random() * outras.length)];
      } else {
        carPosition = selectedDoor;
      }

      // não repetir posição anterior
      if (carPosition === lastCarPosition) {
        const alternativas = [0, 1, 2].filter(p => p !== lastCarPosition);
        carPosition = alternativas[Math.floor(Math.random() * alternativas.length)];
      }

      lastCarPosition = carPosition;
      console.log(`(NO-REPEAT) Posição do carro definida: ${carPosition + 1}`);

    } else if (mode === "super-hard") {
      // TRAPACEIRO PESADO
      const sorte = Math.random();
      if (sorte < 0.2) {
        // só 20% chance de o jogador acertar direto
        carPosition = selectedDoor;
      } else {
        // 80% vai para outra porta
        carPosition = outras[Math.floor(Math.random() * outras.length)];
      }
      console.log(`(SUPER-HARD) Carro definido: ${carPosition + 1}`);
    }
  }

  // revelar cabra
  const possibleDoors = [0, 1, 2].filter(
    d => d !== carPosition && d !== selectedDoor
  );
  revealedDoor = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

  const door = doors[revealedDoor];
  door.classList.add("revealed");
  door.innerHTML = `<img src="imagens/cabra.png" alt="Cabra">`;

  const otherDoor = [0, 1, 2].find(
    d => d !== selectedDoor && d !== revealedDoor
  );

  instruction.textContent = `Você quer manter a sua escolha na Porta ${selectedDoor + 1}, ou trocar para a Porta ${otherDoor + 1}?`;
}

function endGame(finalChoice) {
  gameEnded = true;

  instruction.textContent = `Sua escolha final é a Porta ${finalChoice + 1}.`;

  doors.forEach((door, index) => {
    door.classList.remove("active", "winner", "revealed");

    if (index === carPosition) {
      door.classList.add("winner");
      door.innerHTML = `<img src="imagens/carro.png" alt="Carro">`;
    } else {
      door.classList.add("revealed");
      door.innerHTML = `<img src="imagens/cabra.png" alt="Cabra">`;
    }
  });

  if (finalChoice === carPosition) {
    message.textContent = "Você encontrou o fusca!";
    playAudio("sons/silvio.mp3");
  } else {
    message.textContent = "Você ficou com a cabra!";
    playAudio("sons/faustao.mp3");
  }

  message.style.display = "inline-block";
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
  // alterna entre os 3 modos
  if (mode === "classic") {
    mode = "no-repeat";
  } else if (mode === "no-repeat") {
    mode = "super-hard";
  } else {
    mode = "classic";
  }

  modeSwitch.textContent =
    mode === "classic"
      ? "Modo: CLÁSSICO (aleatório)"
      : mode === "no-repeat"
        ? "Modo: NÃO REPETE (trapaceiro leve)"
        : "Modo: SUPER DIFÍCIL (trapaceiro máximo)";
  initGame();
});

initGame();
