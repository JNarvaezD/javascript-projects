/* VARIABLE INITIALIZATION */
import {
  fillWordContainer,
  returnTargetCardElement,
  setPredefinedWords,
  getRandomWordFromPredefinedWords,
  isOverlapingEmptyCard,
  attachWordToMissingCharCard,
  isWordValid,
  isCharContainerFullButWordIsIncorrect,
} from "./helpers.js";
let newX = 0;
let newY = 0;
let startX = 0;
let startY = 0;
let card = null;
let missingCharCards = [];
let currentWord = "";
let currentLanguageSetUp = "es";
let countDown = null;
const timerEl = document.querySelector(".timer");
/* Default settings object */
const titles = {
  en: {
    title: "GUESS THE WORD!",
    options: [
      { name: "Spanish", lang: "es" },
      { name: "English", lang: "en" },
    ],
    dialogValues: {
      win: {
        text: "CONGRATULATIONS, YOU ARE CORRECT!",
        buttonText: "CONTINUE",
      },
      lose: {
        text: "Don't give up, good luck next time!",
        buttonText: "CONTINUE",
      },
    },
    errorMessageValues: {
      text: "Oh, looks like something is wrong. You can keep trying!",
    },
  },
  es: {
    title: "¡ADIVINA LA PALABRA!",
    options: [
      { name: "Español", lang: "es" },
      { name: "Ingles", lang: "en" },
    ],
    dialogValues: {
      win: {
        text: "¡FELICIDADES, HAS GANADO!",
        buttonText: "CONTINUAR",
      },
      lose: {
        text: "¡No te rindas, buena suerte en tu proximo intento!",
        buttonText: "CONTINUAR",
      },
    },
    errorMessageValues: {
      text: "Oh, parece que algo no esta bien ¡Puedes seguir intentandolo!",
    },
  },
};

/* ELEMENTS SELECTION */
const wordContainerEl = document.querySelector(".word-container");
const missingCharsContainerEl = document.querySelector(
  ".missing-chars-container"
);
const langSelectEl = document.getElementById("lang");
const headingTitleEl = document.querySelector(".heading-title");
const dialogElement = document.querySelector(".status-dialog");
const incorrectWordMessageEl = document.querySelector(".incorrect-word");
const dialogButtonEl = document.querySelector(".dialog-button");
const dialogTextEl = document.querySelector(".dialog-message");

/* GAME TITLES SETUP */
langSelectEl.addEventListener("change", (event) => {
  currentLanguageSetUp = event.target.value;
  setupGameSettings(event.target.value);
});

dialogButtonEl.addEventListener("click", () => {
  showDialog("hidden", "");
  setupGameSettings();
});

function setupGameSettings(language) {
  let currentLanguage = [];

  if (currentLanguageSetUp) {
    language = currentLanguageSetUp;
  }

  if (!language) {
    language = "es";
  }

  currentLanguage = titles[language];
  setPredefinedWords(language);
  headingTitleEl.textContent = currentLanguage.title;

  while (langSelectEl.firstChild) {
    langSelectEl.removeChild(langSelectEl.firstChild);
  }

  currentLanguage.options.forEach((langTitle) => {
    let option = document.createElement("option");
    option.value = langTitle.lang;
    option.text = langTitle.name;
    langSelectEl.append(option);
  });

  langSelectEl.options.selectedIndex = language == "es" ? 0 : 1;
  wordContainerEl.innerHTML = "";
  missingCharsContainerEl.innerHTML = "";
  dialogTextEl.textContent = currentLanguage.dialogValues.win.text;
  dialogButtonEl.textContent = currentLanguage.dialogValues.win.buttonText;
  incorrectWordMessageEl.textContent = currentLanguage.errorMessageValues.text;
  timer();
  setupWordContainers();
}

function setupWordContainers() {
  currentWord = getRandomWordFromPredefinedWords();
  console.log(currentWord);
  const [missingChars, word] = fillWordContainer(currentWord);
  word.forEach((char, index) => {
    const deleteWordButton = "<a class='removable-char' href=''>X</a>";
    const element = `<div class="char-${index} ${
      char ? "" : "empty-char-container"
    }">
      <p class="word-char">${char ? char : "&nbsp;"}</p>
      ${!char ? deleteWordButton : ""}
    </div>`;
    wordContainerEl.insertAdjacentHTML("beforeend", element);
  });

  missingCharCards = [...document.querySelectorAll(".empty-char-container")];

  missingChars.forEach((missingChar, index) => {
    createMissingCharCard(index, missingChar);
  });

  const cards = document.querySelectorAll("[class^='card card--']");

  cards.forEach((card) => addEventListenersToCard(card));

  [...document.querySelectorAll(".removable-char")].forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      removeSelectionFromWordContainer(event);
    });
  });
}

function createMissingCharCard(index, missingChar) {
  const char = `<div class="card card--${index}">
    <p>${missingChar}</p>
  </div>`;
  missingCharsContainerEl.insertAdjacentHTML("afterbegin", char);
}

function addEventListenersToCard(card) {
  card.addEventListener("mousedown", function (event) {
    mouseDown(event);
  });
}

/* SETUP CARD MOVEMENT */
function mouseDown(cardEvent) {
  startX = cardEvent.clientX;
  startY = cardEvent.clientY;

  const currentCard = cardEvent.target.closest(".card");
  if (currentCard) {
    card = returnTargetCardElement(currentCard, 1);
  }
  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
}

function mouseMove(event) {
  newX = startX - event.clientX;
  newY = startY - event.clientY;

  startX = event.clientX;
  startY = event.clientY;

  card.style.top = card.offsetTop - newY + "px";
  card.style.left = card.offsetLeft - newX + "px";
  card.classList.add("on-card-mouse-down");
  card.classList.add("position-fixed");
}

function mouseUp() {
  let overlapedCard = missingCharCards.find(
    (emptyCard) => isOverlapingEmptyCard(card, emptyCard) == true
  );
  if (overlapedCard) {
    attachWordToMissingCharCard(overlapedCard, card);
    const currentWordState = document.querySelectorAll(".word-char");
    const isValid = isWordValid(currentWord, currentWordState);
    if (isValid) {
      showDialog("visible", "blur(2px)");
      clearInterval(countDown);
    }

    if (!isValid && isCharContainerFullButWordIsIncorrect(currentWordState)) {
      incorrectWordMessageEl.classList.add("incorrect-word-message");
      setTimeout(() => {
        incorrectWordMessageEl.classList.remove("incorrect-word-message");
      }, 3000);
    }
  }

  document.removeEventListener("mousemove", mouseMove);
  card.classList.remove("on-card-mouse-down");
  card.classList.remove("position-fixed");
}

function showDialog(visibility, filter) {
  dialogElement.style.visibility = visibility;
  document.querySelector(".container").style.filter = filter;
}

function removeSelectionFromWordContainer(element) {
  const removeButtonUniqueClass = [...element.target.classList].at(-1);
  const char = removeButtonUniqueClass.split("-").at(-1);
  const index = removeButtonUniqueClass.split("-").at(-2);
  element.target.closest(
    `[class^='char-']`
  ).firstElementChild.innerHTML = `&nbsp;`;
  element.target.classList.remove(removeButtonUniqueClass);
  createMissingCharCard(index, char);

  const createdCard = document.querySelector(`.card--${index}`);
  addEventListenersToCard(createdCard);
}

/* Handle reload word */
const reloadIcon = document.querySelector(".reload-word-icon");
reloadIcon.addEventListener("click", () => {
  reloadIcon.style.transform = "rotate(360deg)";
  setupGameSettings();
  setTimeout(() => {
    reloadIcon.style.transition = "none";
    reloadIcon.style.transform = "rotate(0deg)";

    setTimeout(() => {
      reloadIcon.style.transition = "all 0.2s ease";
    }, 50);
  }, 500);
});

function timer() {
  let time = 60;
  clearInterval(countDown);
  countDown = setInterval(() => {
    time--;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerEl.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (time <= 0) {
      timerEl.textContent = "Time's up!";
      dialogTextEl.textContent =
        titles[currentLanguageSetUp].dialogValues.lose.text;
      dialogButtonEl.textContent =
        titles[currentLanguageSetUp].dialogValues.lose.buttonText;
      showDialog("visible", "blur(2px)");
    }
  }, 1000);
}

async function getRandomWord() {
  const apiCall = await fetch(
    "https://random-word-api.herokuapp.com/word?lang=es"
  );

  const data = await apiCall.json();
  return data;
}

setupGameSettings();
