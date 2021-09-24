function rotate_plus() {
  timer_container.style.transform = "rotateX(90deg)";
  timer_container.style.width = "35%";
  timer_container.addEventListener("transitionend", () => {
    timer_container.style.transform = "rotateX(180deg)";
    timer_container.style.width = "30%";
    const minute = document.createElement("li");
    minute.setAttribute("id", "minutes");
    minute.style.transform = "rotateX(180deg)";
    const semi1 = document.createElement("li");
    semi1.innerHTML = ":";
    const second = document.createElement("li");
    second.setAttribute("id", "seconds");
    second.style.transform = "rotateX(180deg)";
    timer_container.innerHTML = "";
    timer_container.appendChild(minute);
    timer_container.appendChild(semi1);
    timer_container.appendChild(second);
  });
}

function rotate_minus() {
  timer_container.style.transform = "rotateX(90deg) ";
  timer_container.style.width = "35%";
  timer_container.addEventListener("transitionend", () => {
    timer_container.style.transform = "rotateX(0deg)";
    timer_container.style.width = "40%";
    const hour = document.createElement("li");
    hour.setAttribute("id", "hour");
    const semi1 = document.createElement("li");
    semi1.innerHTML = ":";
    const minute = document.createElement("li");
    minute.setAttribute("id", "minute");
    const semi2 = document.createElement("li");
    semi2.innerHTML = ":";
    const second = document.createElement("li");
    second.setAttribute("id", "second");
    timer_container.innerHTML = "";
    timer_container.appendChild(hour);
    timer_container.appendChild(semi1);
    timer_container.appendChild(minute);
    timer_container.appendChild(semi2);
    timer_container.appendChild(second);
  });
}

function double_digit(int) {
  const strint = `${int}`;
  if (strint.length === 1) {
    const back = "0".concat(strint);
    return back;
  }
  return strint;
}

function run_plus() {
  const now = ~~(new Date().getTime() / 1000);
  const today = Date().substr(4, 11);
  const days = {
    Mon: 57600,
    Tue: 54300,
    Wed: 63900,
    Thu: 54300,
    Fri: 57600,
    Sat: 0,
    Sun: 0,
  };
  const out = ~~(
    new Date(
      `${today.substr(4, 2)}/${today.substr(0, 3)}/${today.substr(7, 4)}`
    ).getTime() /
      1000 +
    days[Date().substr(0, 3)]
  );
  const timeleft = out - now;
  try {
    const hours = document.getElementById("hour");
    const minutes = document.getElementById("minute");
    const seconds = document.getElementById("second");
    hours.innerHTML = double_digit(~~(timeleft / 3600));
    minutes.innerHTML = double_digit(~~((timeleft / 60) % 60));
    seconds.innerHTML = double_digit(timeleft % 60);
  } catch (err) {}
  setTimeout(run_plus, 100);
}

function run_minus() {
  const now = ~~(new Date().getTime() / 1000);
  const today = Date().substr(4, 11);
  const lessons = [
    30600, 33900, 37800, 41100, 44400, 47700, 51000, 54300, 57600, 60900, 64200,
  ];
  const out = ~~(
    new Date(
      `${today.substr(4, 2)}/${today.substr(0, 3)}/${today.substr(7, 4)}`
    ).getTime() / 1000
  );
  let timeleft = out;
  let x = 0;
  while (timeleft < now) {
    timeleft = out + lessons[x];
    x = x + 1;
  }
  timeleft = timeleft - now;
  try {
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");
    minutes.innerHTML = double_digit(~~((timeleft / 60) % 60));
    seconds.innerHTML = double_digit(timeleft % 60);
  } catch (err) {}
  setTimeout(run_minus, 100);
}

function run_clock(dir) {
  if (dir) {
    run_plus();
  } else {
    run_minus();
  }
}

window.addEventListener("load", () => {
  run_plus();
});

const timer_container = document.getElementById("timer-container");
timer_container.addEventListener("click", () => {
  if (timer_container.style.transform === "rotateX(180deg)") {
    rotate_minus();
    run_clock(1);
  } else {
    rotate_plus();
    run_clock(0);
  }
});
