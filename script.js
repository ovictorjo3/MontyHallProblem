const doors = document.querySelectorAll(".door");
const instruction = document.getElementById("instruction");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");
const modeSwitch = document.getElementById("modeSwitch");

let carPosition;
let selectedDoor = null;
let gameEnded = false;
let mode = "classic"; // "classic", "no-repeat", "super-hard"
let lastCarPosition = null;
let lastRevealedDoor = null; // 🚪 armazenar a última porta revelada

function initGame() {
  gameEnded = false;
  selectedDoor = null;

  doors.forEach(door => {
    door.classList.remove("active", "revealed", "winner");
    door.innerHTML = `<img src="imagens/porta.png" alt="Porta">`;
  });

  message.style.display = "none";
  message.textContent = "";
  instruction.textContent = "Escolha uma porta clicando nela!";
  restartButton.style.display = "none";

  // reset flash se estiver no super-hard
  document.body.classList.remove("flash");

  if (mode === "classic") {
    carPosition = Math.floor(Math.random() * 3);
    console.log(`(CLÁSSICO) Posição do carro: ${carPosition + 1}`);
  } else {
    carPosition = null;
    console.log(`(${mode.toUpperCase()}) Carro ainda não definido!`);
  }
}

function revealGoatDoor() {
  const outras = [0, 1, 2].filter(p => p !== selectedDoor);
  const cabras = outras.filter(p => p !== carPosition);

  let portaRevelada = cabras[Math.floor(Math.random() * cabras.length)];

  // No modo "no-repeat", não repetir a porta revelada da última rodada
  if (mode === "no-repeat" && lastRevealedDoor !== null && cabras.length > 1) {
    while (portaRevelada === lastRevealedDoor) {
      portaRevelada = cabras[Math.floor(Math.random() * cabras.length)];
    }
  }

  const door = doors[portaRevelada];
  door.classList.add("revealed");

  // animação antes de trocar a imagem
  setTimeout(() => {
    door.innerHTML = `<img src="imagens/cabra.png" alt="Cabra">`;
  }, 400);

  lastRevealedDoor = portaRevelada; // salvar porta revelada
  console.log(`Apresentador revelou a porta ${portaRevelada + 1} (cabra).`);
}

function endGame(finalChoice) {
  if (carPosition === null) {
    const outras = [0, 1, 2].filter(p => p !== selectedDoor);

    if (mode === "no-repeat") {
      const sorte = Math.random();
      if (sorte < 0.3) {
        carPosition = outras[Math.floor(Math.random() * outras.length)];
      } else {
        carPosition = selectedDoor;
      }
      if (carPosition === lastCarPosition) {
        const alternativas = [0, 1, 2].filter(p => p !== lastCarPosition);
        carPosition = alternativas[Math.floor(Math.random() * alternativas.length)];
      }
      lastCarPosition = carPosition;
      console.log(`(NO-REPEAT) Posição do carro definida: ${carPosition + 1}`);
    } else if (mode === "super-hard") {
      carPosition = outras[Math.floor(Math.random() * outras.length)];
      console.log(`(SUPER-HARD) Carro definido: ${carPosition + 1}`);
    }
  }

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

    // ⚡ flash/jumpscare só no super-hard
    if (mode === "super-hard") {
      document.body.classList.add("flash");
      setTimeout(() => {
        document.body.classList.remove("flash");
      }, 500);
    }
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
      instruction.textContent = `Você escolheu a Porta ${index + 1}. Clique novamente para confirmar!`;

      // 👉 revelar porta do apresentador, exceto no super-hard
      if (mode !== "super-hard") {
        revealGoatDoor();
      }
    } else {
      endGame(index);
    }
  });
});

restartButton.addEventListener("click", initGame);

modeSwitch.addEventListener("click", () => {
  if (mode === "classic") {
    mode = "no-repeat";
  } else if (mode === "no-repeat") {
    mode = "super-hard";
    document.body.classList.add("super-hard-mode");
  } else {
    mode = "classic";
    document.body.classList.remove("super-hard-mode");
  }

  modeSwitch.textContent =
    mode === "classic"
      ? "Modo: CLÁSSICO (aleatório)"
      : mode === "no-repeat"
        ? "Modo: NÃO REPETE (trapaceiro leve)"
        : "Modo: SUPER DIFÍCIL (sem revelação)";
  initGame();
});

initGame();
