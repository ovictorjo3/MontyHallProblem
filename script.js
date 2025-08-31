let prizeDoor;
let lastPrizeDoor = null;   
let lastPrizeDoorPrev = null; // porta do carro da rodada anterior para o modo não repete
let noRepeatMode = false;   

let chosenDoor = null;
let revealedDoor = null;
let phase = 'picking'; 
let gameOver = false;

const doors = document.querySelectorAll(".door");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const instruction = document.getElementById("instruction");
const modeSwitchBtn = document.getElementById("modeSwitch");

const winSound = new Audio();
winSound.src = "sons/ganhou.mp3"; 
winSound.volume = 0.8; 

const loseSound = new Audio();
loseSound.src = "sons/errou(faustao).mp3"; 
loseSound.volume = 0.9; 

function startGame() {
  if (noRepeatMode && lastPrizeDoor !== null) {
    // evita repetir a porta premiada
    do {
      prizeDoor = Math.floor(Math.random() * 3);
    } while (prizeDoor === lastPrizeDoor);
  } else {
    // modo clássico
    prizeDoor = Math.floor(Math.random() * 3);
  }

  lastPrizeDoor = prizeDoor;
  console.log("Fusca escondido na porta:", prizeDoor + 1);

  chosenDoor = null;
  revealedDoor = null;
  phase = 'picking';
  gameOver = false;

  message.textContent = "";
  instruction.textContent = "Escolha uma porta clicando nela!";
  restartBtn.style.display = "none";

  doors.forEach((door, i) => {
    door.style.backgroundColor = "white";
    door.querySelector("img").src = "imagens/porta.png";
    door.style.pointerEvents = "auto";
    door.style.border = "3px solid transparent";
    
    if (door.dataset.index === undefined) door.dataset.index = i;
  });
  modeSwitchBtn.disabled = true;
}

function onDoorClick(e) {
  const door = e.currentTarget;
  const i = parseInt(door.dataset.index, 10);

  if (gameOver) return;

  if (phase === 'picking') {
    chosenDoor = i;
    doors[chosenDoor].style.backgroundColor = "#a0e6a0";

    let availableDoors = [0,1,2].filter(d => d !== chosenDoor && d !== prizeDoor);

    // Forçar cabra na porta que tinha o carro na rodada anterior
    if (noRepeatMode && lastPrizeDoorPrev !== null && availableDoors.includes(lastPrizeDoorPrev)) {
      revealedDoor = lastPrizeDoorPrev; 
    } else {
      revealedDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];
    }

    doors[revealedDoor].style.backgroundColor = "#f28c8c";
    doors[revealedDoor].querySelector("img").src = "imagens/cabra.png";
    doors[revealedDoor].style.pointerEvents = "none"; 

    const remainingDoor = [0, 1, 2].find(idx => idx !== chosenDoor && idx !== revealedDoor);
    doors[remainingDoor].style.backgroundColor = "#a0e6a0";

    instruction.textContent = `Você escolheu a porta ${chosenDoor + 1}`;
    message.textContent = `O apresentador abriu a porta ${revealedDoor + 1}! Clique na sua porta para manter ou na outra para trocar.`;

    doors[chosenDoor].style.border = "3px solid #1e90ff";
    doors[remainingDoor].style.border = "3px solid #1e90ff";

    doors.forEach((d, idx) => {
      d.style.pointerEvents = (idx === chosenDoor || idx === remainingDoor) ? "auto" : "none";
    });

    phase = 'decide';
    return;
  }

  if (phase === 'decide') {
    if (i === revealedDoor) return;

    const finalChoice = i;

    if (finalChoice === chosenDoor) {
      instruction.textContent = `Você manteve sua escolha na porta ${finalChoice + 1}`;
    } else {
      instruction.textContent = `Você trocou para a porta ${finalChoice + 1}`;
    }

    endGame(finalChoice);
    return;
  }
}

function endGame(finalChoice) {
  phase = 'ended';
  gameOver = true;

  doors.forEach((door, idx) => {
    const img = door.querySelector("img");
    if (idx === prizeDoor) {
      img.src = "imagens/carro.png";
    } else {
      img.src = "imagens/cabra.png";
    }
    door.style.pointerEvents = "none";
    door.style.border = "3px solid transparent";
  });

  const acao = (finalChoice === chosenDoor) ? "mantendo" : "trocando";

  if (finalChoice === prizeDoor) {
    message.textContent = `Parabéns! Você encontrou o fusca :-)`;
    playWinSound();
  } else {
    message.textContent = `Você perdeu ${acao} sua escolha na porta ${finalChoice + 1}. O fusca estava na porta ${prizeDoor + 1}.`;
    playLoseSound();
  }

  restartBtn.style.display = "inline-block";
  modeSwitchBtn.disabled = false;
  
  // Atualiza lastPrizeDoorPrev para a próxima rodada
  lastPrizeDoorPrev = prizeDoor;
}

function playWinSound() {
  try {
    stopAllSounds();
    winSound.play();
    setTimeout(() => {
      winSound.pause();
      winSound.currentTime = 0;
    }, 3000); 
  } catch (error) {
    console.log("Erro ao reproduzir som de vitória:", error);
  }
}

function playLoseSound() {
  try {
    stopAllSounds();
    loseSound.play();
    setTimeout(() => {
      loseSound.pause();
      loseSound.currentTime = 0;
    }, 4000); 
  } catch (error) {
    console.log("Erro ao reproduzir som de derrota:", error);
  }
}

function stopAllSounds() {
  winSound.pause();
  winSound.currentTime = 0;
  loseSound.pause();
  loseSound.currentTime = 0;
}


modeSwitchBtn.addEventListener("click", () => {
  noRepeatMode = !noRepeatMode;
  modeSwitchBtn.textContent = noRepeatMode 
    ? "Modo: NÃO REPETE porta" 
    : "Modo: CLÁSSICO (aleatório)";
});


doors.forEach(door => door.addEventListener("click", onDoorClick));
restartBtn.addEventListener("click", startGame);


startGame();
