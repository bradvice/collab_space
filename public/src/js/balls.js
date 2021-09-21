function move_ball(movement, ballid) {
  bodyrect = document.body.getBoundingClientRect();
  ball = document.getElementById(ballid);
  ballrect = ball.getBoundingClientRect();
  if (ballrect.left < bodyrect.left || ballrect.right > bodyrect.right) {
    movement[0] = -movement[0];
  }
  if (
    ballrect.top < bodyrect.top + (bodyrect.bottom / 100) * 11 ||
    ballrect.bottom > bodyrect.bottom
  ) {
    movement[1] = -movement[1];
  }
  ball.style.left = `${ballrect.left + movement[0]}px`;
  ball.style.top = `${ballrect.top + movement[1]}px`;
  setTimeout(move_ball, 2, movement, ballid);
}

window.addEventListener("load", () => {
  for (let i = 1; i < 51; i++) {
    const ball = document.createElement("div");
    ball.setAttribute("id", `ball${i}`);
    ball.setAttribute("class", "ball");
    document.getElementById("main").appendChild(ball);
  }
  const balls = document.getElementsByClassName("ball");
  let count = 0;
  for (let i = 0; i < 8; i++) {
    for (let x = 0; x < 7; x++) {
      count++;
      move_ball([i - 3, x - 3], balls[count].id);
    }
  }
});
