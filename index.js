/**@type{HTMLCanvasElement} */
class Game {
  constructor(canvas, context, canvas2, context2) {
    this.canvas = canvas;
    this.ctx = context;
    this.canvas2 = canvas2;
    this.ctx2 = context2;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.cellSize = 80;
    this.rows;
    this.columns;
    this.topMargin = 2;
    this.players = [];

    this.eventTimer = 0;
    this.eventInterval = 500;
    this.eventUpdate = false;
    this.timer = 0;

    this.gameOver = true;
    this.winningScore = 10;
    this.player1;
    this.player2;
    this.player3;
    this.player4;
    this.food;
    this.gameUi;
    this.topBackground;
    this.debug = false;
    this.sound = new AudioControl();

    this.particlesArray = [];
    this.numParticles = 50;
    this.createParticlePool();

    window.addEventListener("keyup", (e) => {
      if (e.key === "-") {
        this.toggleFullScreen();
      } else if (e.key === "+") {
        this.debug = !this.debug;
      }
    });

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    this.resize(window.innerWidth, window.innerHeight);
    //this.start()
  }
  resize(width, height) {
    this.width = width - (width % this.cellSize);
    this.height = height - (height % this.cellSize);
    this.ctx.font = "20px Impact";
    this.ctx.textBaseLine = "top";
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvas2.width = this.width;
    this.canvas2.height = this.height;
    this.ctx2.fillStyle = "gold";
    this.ctx2.lineWidth = 2;

    this.rows = Math.floor(this.height / this.cellSize);
    this.columns = Math.floor(this.width / this.cellSize);
    this.gameUi = new Ui(this);
    this.topBackground;
    this.topBackground = new Background(this);
  }
  initPlayer1() {
    const image = document.getElementById(this.gameUi.player1Character.value);
    const name = this.gameUi.player1name.value;
    if (this.gameUi.player1controls.value === "arrows") {
      this.player1 = new KeyBoard1(
        this,
        this.columns - 1,
        this.rows - 1,
        0,
        0,
        "yellow",
        name,
        image
      );
    } else {
      this.player1 = new ComputerAI(
        this,
        this.columns - 1,
        this.rows - 1,
        0,
        0,
        "yellow",
        name,
        image
      );
    }
  }
  initPlayer2() {
    const image = document.getElementById(this.gameUi.player2Character.value);
    const name = this.gameUi.player2name.value;
    if (this.gameUi.player2controls.value === "wsad") {
      this.player2 = new KeyBoard2(
        this,
        0,
        this.rows - 1,
        0,
        0,
        "blue",
        name,
        image
      );
    } else {
      this.player2 = new ComputerAI(
        this,
        0,
        this.rows - 1,
        0,
        0,
        "blue",
        name,
        image
      );
    }
  }
  initPlayer3() {
    const image = document.getElementById(this.gameUi.player3Character.value);
    const name = this.gameUi.player3name.value;
    this.player3 = new ComputerAI(
      this,
      this.columns - 1,
      this.topMargin,
      -1,
      0,
      "orange",
      name,
      image
    );
  }
  initPlayer4() {
    const image = document.getElementById(this.gameUi.player4Character.value);
    const name = this.gameUi.player4name.value;
    this.player4 = new ComputerAI(
      this,
      0,
      this.topMargin,
      1,
      0,
      "red",
      name,
      image
    );
  }
  start() {
    if (!this.gameOver) {
      this.gameUi.triggerGameOver();
      this.sound.play(this.sound.restartSound);
    } else {
      this.sound.play(this.sound.startSound);
      this.gameOver = false;
      this.timer = 0;
      this.gameUi.gamePlayUi();
      this.initPlayer1();
      this.initPlayer2();
      this.initPlayer3();
      this.initPlayer4();

      this.food = new Food(this, "white");
      this.players = [
        this.player1,
        this.player2,
        this.player3,
        this.player4,
        this.food,
      ];
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
  drawGrid() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.ctx.strokeRect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }
  }
  checkCollisions(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  handlePeriodicEvents(deltaTime) {
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      this.eventTimer = 0;
      this.eventUpdate = true;
    }
  }
  createParticlePool() {
    for (let i = 0; i < this.numParticles; i++) {
      this.particlesArray.push(new Particle(this));
    }
  }
  getParticles() {
    for (let i = 0; i < this.particlesArray.length; i++) {
      if (this.particlesArray[i].free) {
        return this.particlesArray[i];
      }
    }
  }
  handleParticles() {
    this.ctx2.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].draw();
      this.particlesArray[i].update();
    }
  }
  formatTimer() {
    return (this.timer * 0.001).toFixed(1);
  }
  render(deltaTime) {
    if (!this.gameOver) this.timer += deltaTime;
    this.handlePeriodicEvents(deltaTime);
    if (this.eventUpdate && !this.gameOver) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.topBackground.draw();
      if (this.debug) {
        this.drawGrid();
      }
      this.players.forEach((player) => {
        player.draw();
        player.update();
      });
      this.gameUi.update();
    }
    this.handleParticles();
  }
}

window.addEventListener("load", () => {
  /**@type{HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const canvas2 = document.getElementById("canvas2");
  const ctx2 = canvas2.getContext("2d");
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;

  const game = new Game(canvas, ctx, canvas2, ctx2);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
