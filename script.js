(function () {
  "use strict";

  var arena = document.getElementById("arena");
  var ball = document.getElementById("ball");
  var scoreElement = document.getElementById("score");
  var restartButton = document.getElementById("restart");

  var state = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    score: 0,
    width: 0,
    height: 0,
    size: 0,
    lastTime: 0
  };

  var BASE_SPEED = 170;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function measure() {
    state.width = arena.clientWidth;
    state.height = arena.clientHeight;
    state.size = ball.offsetWidth;
    state.x = clamp(state.x, 0, Math.max(0, state.width - state.size));
    state.y = clamp(state.y, 0, Math.max(0, state.height - state.size));
  }

  function render() {
    ball.style.transform = "translate3d(" + state.x + "px, " + state.y + "px, 0)";
  }

  function launch() {
    var angle = Math.random() * Math.PI * 2;
    var speed = BASE_SPEED * (0.85 + Math.random() * 0.3);
    state.vx = Math.cos(angle) * speed;
    state.vy = Math.sin(angle) * speed;

    if (Math.abs(state.vx) < 60) {
      state.vx = state.vx < 0 ? -60 : 60;
    }
    if (Math.abs(state.vy) < 60) {
      state.vy = state.vy < 0 ? -60 : 60;
    }
  }

  function reset() {
    state.score = 0;
    scoreElement.textContent = "0";
    measure();
    state.x = Math.random() * Math.max(0, state.width - state.size);
    state.y = Math.random() * Math.max(0, state.height - state.size);
    launch();
    render();
  }

  function tick(time) {
    if (!state.lastTime) {
      state.lastTime = time;
    }

    var delta = Math.min((time - state.lastTime) / 1000, 0.05);
    state.lastTime = time;

    state.x += state.vx * delta;
    state.y += state.vy * delta;

    var maxX = Math.max(0, state.width - state.size);
    var maxY = Math.max(0, state.height - state.size);

    if (state.x <= 0) {
      state.x = 0;
      state.vx = Math.abs(state.vx);
    } else if (state.x >= maxX) {
      state.x = maxX;
      state.vx = -Math.abs(state.vx);
    }

    if (state.y <= 0) {
      state.y = 0;
      state.vy = Math.abs(state.vy);
    } else if (state.y >= maxY) {
      state.y = maxY;
      state.vy = -Math.abs(state.vy);
    }

    render();
    window.requestAnimationFrame(tick);
  }

  function addPoint() {
    state.score += 1;
    scoreElement.textContent = String(state.score);
    ball.classList.remove("ball--hit");
    void ball.offsetWidth;
    ball.classList.add("ball--hit");
  }

  ball.addEventListener("click", function (event) {
    event.stopPropagation();
    addPoint();
  });

  ball.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      addPoint();
    }
  });

  restartButton.addEventListener("click", reset);
  window.addEventListener("resize", measure);

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(measure).observe(arena);
  }

  reset();
  window.requestAnimationFrame(tick);
})();
