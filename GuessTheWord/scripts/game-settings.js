let time = 120;
const timerEl = document.querySelector(".timer");

function timer() {
  const countDown = setInterval(() => {
    time--;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerEl.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (time <= 0) {
      clearInterval(countDown);
      timerEl.textContent = "Time's up!";
    }
  }, 1000);
}

export { timer };
