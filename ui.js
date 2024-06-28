class Ui {
  constructor(game) {
    this.game = game;
    //display score
    this.scoreBoard1 = document.getElementById("scoreBoard1");
    this.scoreBoard2 = document.getElementById("scoreBoard2");
    this.scoreBoard3 = document.getElementById("scoreBoard3");
    this.scoreBoard4 = document.getElementById("scoreBoard4");
    //game over screen
    this.gameOverScreen = document.getElementById("gameOverScreen");
    //controls
    this.player1controls = document.getElementById("player1controls");
    this.player2controls = document.getElementById("player2controls");
    this.player3controls = document.getElementById("player3controls");
    this.player4controls = document.getElementById("player4controls");
    //game menu
    this.gameMenu = document.getElementById("gameMenu");
    //names
    this.player1name = document.getElementById("player1name");
    this.player2name = document.getElementById("player2name");
    this.player3name = document.getElementById("player3name");
    this.player4name = document.getElementById("player4name");
    //characters
    this.player1Character = document.getElementById("player1Character");
    this.player2Character = document.getElementById("player2Character");
    this.player3Character = document.getElementById("player3Character");
    this.player4Character = document.getElementById("player4Character");
    //messages
    this.message1 = document.getElementById("message1");
    this.message2 = document.getElementById("message2");

    //buttons
    this.startBtn = document.getElementById("startBtn");
    this.startBtn.addEventListener("click", () => {
      this.game.start();
    });
    this.fullScreenBtn = document.getElementById("fullScreenBtn");
    this.fullScreenBtn.addEventListener("click", () => {
      this.game.toggleFullScreen();
      this.game.sound.play(this.game.sound.button);
    });
    this.debugBtn = document.getElementById("debugBtn");
    this.debugBtn.addEventListener("click", () => {
      this.game.debug = !this.game.debug;
      this.game.sound.play(this.game.sound.button);
    });
  }
  update() {
    this.scoreBoard1.innerText =
      this.game.player1.name + ":  " + this.game.player1.score;
    this.scoreBoard2.innerText =
      this.game.player2.name + ":  " + this.game.player2.score;
    this.scoreBoard3.innerText =
      this.game.player3.name + ":  " + this.game.player3.score;
    this.scoreBoard4.innerText =
      this.game.player4.name + ":  " + this.game.player4.score;
  }
  triggerGameOver(winner) {
    this.game.gameOver = true;
    this.gameOverUi();
    if (winner) {
      this.message1.innerText = winner.name + " Wins!";
      this.message2.innerText =
        " Game time " + this.game.formatTimer() + " seconds";
      for (let i = 0; i < this.game.numParticles; i++) {
        const particle = this.game.getParticles();
        if (particle) {
          particle.start(
            Math.random() * this.game.width,
            this.game.height * 0.9,
            "gold"
          );
        }
      }
    } else {
      this.message1.innerText = "Welcome to the battle arena!";
      this.message2.innerText = "Choose your fighter";
    }
  }
  gamePlayUi() {
    this.gameMenu.style.display = "none";
    this.startBtn.innerText = "Restart";
    this.gameOverScreen.style.display = "none";
  }
  gameOverUi() {
    this.gameMenu.style.display = "block";
    this.startBtn.innerText = "Start";
    this.gameOverScreen.style.display = "block";
  }
}
