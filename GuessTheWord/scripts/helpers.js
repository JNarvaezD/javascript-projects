import { predefinedWords } from "./words.js";
let words = [];

function fillWordContainer(word) {
  const [missingChars, remainingChars] = returnWordParts(word);
  return [missingChars, remainingChars];
}

const generateRandomNumber = (currentIndexes, limit) => {
  let canFinishLoop = false;
  let index = null;
  while (!canFinishLoop) {
    index = Math.floor(Math.random() * limit);
    if (!currentIndexes.includes(index)) {
      canFinishLoop = true;
    }
  }
  return index;
};

function returnWordParts(word) {
  const missingChars = [];
  const remainingChars = [];

  const splitedWord = word.split("");

  const missingCharsNumber = returnMissingCharsNumber(splitedWord);
  const missingCharIndexes = returnMissingCharsIndexes(
    missingCharsNumber,
    splitedWord.length
  );

  for (let index = 0; index < splitedWord.length; index++) {
    if (missingCharIndexes.includes(index)) {
      missingChars.push(splitedWord[index]);
      remainingChars[index] = "";
      missingChars.push(generateRandomChar(missingChars));
      continue;
    }
    remainingChars[index] = splitedWord[index];
  }

  return [missingChars, remainingChars];
}

function returnMissingCharsNumber(splitedWord) {
  if (splitedWord.length % 2 == 0) {
    return splitedWord.length / 2;
  }
  return splitedWord.length / 3;
}

function returnMissingCharsIndexes(charsQuantity, limit) {
  let charIndexes = [];
  for (let index = 0; index < charsQuantity; index++) {
    const charIndex = generateRandomNumber(charIndexes, limit);
    charIndexes.push(charIndex);
  }

  return charIndexes;
}

function generateRandomChar(currentChars) {
  let findUniqueChar = false;
  let char = "";
  while (!findUniqueChar) {
    const generateRandomChar = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    );
    if (!currentChars.includes(generateRandomChar)) {
      findUniqueChar = true;
      char = generateRandomChar;
    }
  }
  return char;
}

function returnTargetCardElement(element, uniqueClassIndex) {
  return document.querySelector(`.${[...element.classList][uniqueClassIndex]}`);
}

function attachWordToMissingCharCard(targetCard, missingCharCard) {
  targetCard.firstElementChild.textContent =
    missingCharCard.firstElementChild.textContent;

  const missingCharCardOriginalIndex = missingCharCard.classList
    .item(1)
    .split("--")
    .at(-1);
  targetCard.lastElementChild.classList.add(
    `display-remove-button-${missingCharCardOriginalIndex}-${missingCharCard.firstElementChild.textContent}`
  );
  targetCard.lastElementChild.textContent = "X";
  deleteElementFromDOM(missingCharCard);
}

function deleteElementFromDOM(card) {
  card.remove();
}

function setPredefinedWords(currentLang) {
  words = predefinedWords[currentLang];
}

function getRandomWordFromPredefinedWords() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

function isOverlapingEmptyCard(card, target) {
  if (!card && !target) {
    return;
  }

  const cardRect = card.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  // Check if all sides of the target are within the bounds of the card
  return (
    targetRect.left >= cardRect.left &&
    targetRect.right <= cardRect.right &&
    targetRect.top >= cardRect.top &&
    targetRect.bottom <= cardRect.bottom
  );
}

function isWordValid(currentWord, currentWordState) {
  const joinWordElements = [...currentWordState]
    .map((word) => {
      return word.textContent;
    })
    .join("");
  if (currentWord == joinWordElements) {
    return true;
  }
  return false;
}

export {
  fillWordContainer,
  returnTargetCardElement,
  deleteElementFromDOM,
  setPredefinedWords,
  getRandomWordFromPredefinedWords,
  isOverlapingEmptyCard,
  attachWordToMissingCharCard,
  isWordValid,
};
