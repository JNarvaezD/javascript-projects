"stric-mode";

const gameLayout = document.querySelector(".game--layout");
const currentColourToGuess = document.querySelector(".color_to_guess");
const playerTriesTag = document.querySelector(".number_tries");
const playerCurrentStreakTag = document.querySelector(".current_streak");
const statusMessage = document.querySelector(".status_modal--message");
const modalButton = document.getElementById("game_manager");
const statusModal = document.querySelector(".status_modal");

let playerTries = 3;
let playerCurrentStreak = 0;
let correctAnswer = null;

buildGameLayoutOptions();

function buildGameLayoutOptions() {
  gameLayout.innerHTML = "";
  const coloursArray = returnColoursArray();
  coloursArray.forEach((value) => {
    gameLayout.insertAdjacentHTML(
      "afterbegin",
      `<div style='background: ${value}' class="colour--option"></div>`
    );
  });
  correctAnswer = returnRandomCorrectAnswer(coloursArray);
  currentColourToGuess.innerText = correctAnswer.toUpperCase();
}

function returnColoursArray() {
  colours = [];
  for (let i = 0; i < 6; i++) {
    colour = [];
    for (let j = 0; j < 3; j++) {
      const randomNumber = Math.floor(Math.random() * 256) + 1;
      colour.push(randomNumber);
    }
    colours.push(`rgb(${colour.join(", ")})`);
  }

  return colours;
}

function returnRandomCorrectAnswer(coloursArray) {
  return coloursArray[Math.floor(Math.random() * coloursArray.length)];
}

function defaultSettings() {
  buildGameLayoutOptions();
  playerTries = 3;
  playerTriesTag.innerHTML = playerTries;
}

gameLayout.addEventListener("click", function (event) {
  const isColourOption = [...event.target.classList];
  if (
    isColourOption.includes("colour--option") &&
    [...statusModal.classList].includes("do_not_display_modal")
  ) {
    const optionBackground = event.target.style.background;
    if (playerTries > 1) {
      if (optionBackground === correctAnswer) {
        statusMessage.innerHTML = "YOU WIN!";
        statusModal.classList.toggle("do_not_display_modal");
      } else {
        playerTries--;
        playerTriesTag.innerHTML = playerTries;
      }
    } else {
      statusMessage.innerHTML = "YOU LOSE, TRY AGAIN!";
      statusModal.classList.toggle("do_not_display_modal");
    }
  }
});

modalButton.addEventListener("click", () => {
  const didPlayerWin = statusMessage.innerHTML === "YOU WIN!";
  if (didPlayerWin) {
    defaultSettings();
    playerCurrentStreak++;
    playerCurrentStreakTag.innerHTML = playerCurrentStreak;
  } else {
    defaultSettings();
    playerCurrentStreak = 0;
    playerCurrentStreakTag.innerHTML = playerCurrentStreak;
  }
  statusModal.classList.toggle("do_not_display_modal");
});
