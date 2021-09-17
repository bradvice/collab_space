function rotate_plus() {
  timer_container.style.transform = "rotateX(90deg)";
  timer_container.style.width = "30%";
  timer_container.addEventListener("transitionend", () => {
    timer_container.style.transform = "rotateX(180deg)";
    const hour = document.createElement("li");
    hour.setAttribute("id", "hour");
    const semi1 = document.createElement("li");
    semi1.innerHTML = ":";
    const minute = document.createElement("li");
    minute.setAttribute("id", "minute");
    timer_container.innerHTML = "";
    timer_container.appendChild(hour);
    timer_container.appendChild(semi1);
    timer_container.appendChild(minute);
  });
}

function rotate_minus() {
  timer_container.style.transform = "rotateX(90deg)";
  timer_container.style.width = "40%";
  timer_container.addEventListener("transitionend", () => {
    timer_container.style.transform = "rotateX(0deg)";
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

const timer_container = document.getElementById("timer-container");
timer_container.addEventListener("click", () => {
  if (timer_container.style.transform === "rotate3d(1, 1, 1, 360deg)") {
    rotate_minus();
  } else {
    rotate_plus();
  }
});
