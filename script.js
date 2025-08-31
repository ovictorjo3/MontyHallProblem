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

  message.style.display = "none";
  message.textContent = "";
  instruction.textContent = "Escolha uma porta clicando nela!";
  restartButton.style.display = "none";

  if (mode === "classic") {
    
    carPosition = Math.floor(Math.random() * 3);
    console.log(`(CLÁSSICO) Posição do carro: ${carPosition + 1}`);
  } else {
    
    carPosition = null;
    console.log("(NO-REPEAT / TRAPACEIRO) Carro ainda não definido!");
  }
}

function revealGoatDoor() {
  
  if (mode !== "classic" && carPosition === null) {
    const outras = [0, 1, 2].filter(p => p !== selectedDoor);

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
    console.log(`(TRAPACEIRO) Posição do carro definida: ${carPosition + 1}`);
  }

  
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
  mode = mode === "classic" ? "no-repeat" : "classic";
  modeSwitch.textContent =
    mode === "classic"
      ? "Modo: CLÁSSICO (aleatório)"
      : "Modo: NÃO REPETE (trapaceiro)";
  initGame();
});

initGame();
