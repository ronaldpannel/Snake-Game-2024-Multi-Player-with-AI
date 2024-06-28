class Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
    this.name = name;
    this.width = this.game.cellSize;
    this.height = this.game.cellSize;
    this.isMoving = true;
    this.score = 0;
    this.length = 3;
    this.segments = [];
    for (let i = 0; i < this.length; i++) {
      if (i > 0) {
        this.x += this.speedX;
        this.y += this.speedY;
      }

      this.segments.unshift({ x: this.x, y: this.y, frameX: 5, frameY: 0 });
    }
    this.readyToTurn = true;
    this.image = image;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
  }
  update() {
    this.readyToTurn = true;
    //check collision
    if (this.game.checkCollisions(this, this.game.food)) {
      let color;
      if (this.game.food.frameY === 1) {
        this.score--;
        color = "black";
        this.game.sound.play(this.game.sound.badFood);
        if (this.length > 3) {
          this.length--;
          if (this.segments.length < this.length) {
            this.segments.pop();
          }
        }
      } else {
        this.score++;
        this.length++;
        color = "gold";
        //  this.game.sound.play(this.game.sound.bite5)
        this.game.sound.play(
          this.game.sound.biteSounds[
            Math.floor(Math.random() * this.game.sound.biteSounds.length)
          ]
        );
      }
      for (let i = 0; i < 5; i++) {
        const particle = this.game.getParticles();
        if (particle) {
          particle.start(
            this.game.food.x * this.game.cellSize + this.game.cellSize * 0.5,
            this.game.food.y * this.game.cellSize + this.game.cellSize * 0.5,
            color
          );
        }
      }

      this.game.food.reset();
    }

    //check boundaries
    if (
      (this.x <= 0 && this.speedX < 0) ||
      (this.x >= this.game.columns - 1 && this.speedX > 0) ||
      (this.y <= this.game.topMargin && this.speedY < 0) ||
      (this.y >= this.game.rows - 1 && this.speedY > 0)
    ) {
      this.isMoving = false;
    }
    if (this.isMoving) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.segments.unshift({ x: this.x, y: this.y, frameX: 0, frameY: 0 });
    }
    if (this.segments.length >= this.length) {
      this.segments.pop();
    }
    //win condition
    if (this.score >= this.game.winningScore) {
      this.game.gameUi.triggerGameOver(this);
      this.game.sound.play(this.game.sound.win);
    }
  }
  draw() {
    this.segments.forEach((segment, i) => {
      if (i === 0) {
        this.game.ctx.fillStyle = "gold";
      } else {
        this.game.ctx.fillStyle = this.color;
      }
      if (this.game.debug) {
        this.game.ctx.fillRect(
          segment.x * this.game.cellSize,
          segment.y * this.game.cellSize,
          this.width,
          this.height
        );
      }
      this.setSpriteFrame(i);
      this.game.ctx.drawImage(
        this.image,
        segment.frameX * this.spriteWidth,
        segment.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        segment.x * this.game.cellSize,
        segment.y * this.game.cellSize,
        this.game.cellSize,
        this.game.cellSize
      );
    });
  }
  turnUp() {
    if (this.speedY === 0 && this.y > this.game.topMargin && this.readyToTurn) {
      this.speedX = 0;
      this.speedY = -1;
      this.isMoving = true;
      this.readyToTurn = false;
    }
  }
  turnDown() {
    if (this.speedY === 0 && this.y < this.game.rows - 1 && this.readyToTurn) {
      this.speedX = 0;
      this.speedY = 1;
      this.isMoving = true;
      this.readyToTurn = false;
    }
  }
  turnLeft() {
    if (this.speedX === 0 && this.x > 0 && this.readyToTurn) {
      this.speedX = -1;
      this.speedY = 0;
      this.isMoving = true;
      this.readyToTurn = false;
    }
  }
  turnRight() {
    if (
      this.speedX === 0 &&
      this.x < this.game.columns - 1 &&
      this.readyToTurn
    ) {
      this.speedX = 1;
      this.speedY = 0;
      this.isMoving = true;
      this.readyToTurn = false;
    }
  }
  setSpriteFrame(index) {
    const segment = this.segments[index];
    const nextSegment = this.segments[index + 1] || 0;
    const prevSegment = this.segments[index - 1] || 0;
    if (index === 0) {
      // head
      if (segment.y < nextSegment.y) {
        if (Food.y === segment.y - 1 && Food.x === segment.x) {
          segment.frameX = 7;
          segment.frameY = 1;
        } else {
          segment.frameX = 1;
          segment.frameY = 2;
        }
      } else if (segment.y > nextSegment.y) {
        if (Food.y === segment.y + 1 && Food.x === segment.x) {
          segment.frameX = 7;
          segment.frameY = 3;
        } else {
          segment.frameX = 0;
          segment.frameY = 4;
        }
      } else if (segment.x < nextSegment.x) {
        if (
          this.game.food.x === segment.x - 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 2;
          segment.frameY = 4;
        } else {
          segment.frameX = 0;
          segment.frameY = 0;
        }
      } else if (segment.x > nextSegment.x) {
        if (
          this.game.food.x === segment.x + 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 4;
          segment.frameY = 4;
        } else {
          segment.frameX = 2;
          segment.frameY = 1;
        }
      }
    } else if (index === this.segments.length - 1) {
      //tal
      if (prevSegment.y < segment.y) {
        segment.frameX = 1;
        segment.frameY = 4;
      } else if (prevSegment.y > segment.y) {
        segment.frameX = 0;
        segment.frameY = 2;
      } else if (prevSegment.x < segment.x) {
        segment.frameX = 2;
        segment.frameY = 0;
      } else if (prevSegment.x > segment.x) {
        segment.frameX = 0;
        segment.frameY = 1;
      }
    } else {
      //body
      if (nextSegment.x < segment.x && prevSegment.x > segment.x) {
        segment.frameX = 1;
        segment.frameY = 1;
      } else if (nextSegment.x > segment.x && prevSegment.x < segment.x) {
        segment.frameX = 1;
        segment.frameY = 0;
      } else if (nextSegment.y > segment.y && prevSegment.y < segment.y) {
        segment.frameX = 1;
        segment.frameY = 3;
      } else if (nextSegment.y < segment.y && prevSegment.y > segment.y) {
        segment.frameX = 0;
        segment.frameY = 3;
        //corners counter clockwise
      } else if (prevSegment.x < segment.x && nextSegment.y > segment.y) {
        segment.frameX = 4;
        segment.frameY = 0;
      } else if (prevSegment.y > segment.y && nextSegment.x > segment.x) {
        segment.frameX = 3;
        segment.frameY = 0;
      } else if (prevSegment.x > segment.x && nextSegment.y < segment.y) {
        segment.frameX = 3;
        segment.frameY = 1;
      } else if (prevSegment.y < segment.y && nextSegment.x < segment.x) {
        segment.frameX = 4;
        segment.frameY = 1;
        //corners clockwise
      } else if (nextSegment.x < segment.x && prevSegment.y > segment.y) {
        segment.frameX = 3;
        segment.frameY = 2;
      } else if (nextSegment.y < segment.y && prevSegment.x < segment.x) {
        segment.frameX = 3;
        segment.frameY = 3;
      } else if (nextSegment.x > segment.x && prevSegment.y < segment.y) {
        segment.frameX = 2;
        segment.frameY = 3;
      } else if (nextSegment.y > segment.y && prevSegment.x > segment.x) {
        segment.frameX = 2;
        segment.frameY = 2;
      } else {
        // segment.frameX = 6;
        // segment.frameY = 0;
      }
    }
  }
}
class KeyBoard1 extends Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        this.turnUp();
      }
      if (e.key === "ArrowDown") {
        this.turnDown();
      }
      if (e.key === "ArrowLeft") {
        this.turnLeft();
      }
      if (e.key === "ArrowRight") {
        this.turnRight();
      }
    });
  }
  setSpriteFrame(index) {
    const segment = this.segments[index];
    const nextSegment = this.segments[index + 1] || 0;
    const prevSegment = this.segments[index - 1] || 0;
    if (index === 0) {
      // head
      if (segment.y < nextSegment.y) {
        if (
          this.game.food.y === segment.y - 1 &&
          this.game.food.x === segment.x
        ) {
          segment.frameX = 7;
          segment.frameY = 1;
        } else {
          segment.frameX = 1;
          segment.frameY = 2;
        }
      } else if (segment.y > nextSegment.y) {
        if (
          this.game.food.y === segment.y + 1 &&
          this.game.food.x === segment.x
        ) {
          segment.frameX = 7;
          segment.frameY = 3;
        } else {
          segment.frameX = 0;
          segment.frameY = 4;
        }
      } else if (segment.x < nextSegment.x) {
        if (
          this.game.food.x === segment.x - 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 2;
          segment.frameY = 4;
        } else {
          segment.frameX = 4;
          segment.frameY = 2;
        }
      } else if (segment.x > nextSegment.x) {
        if (
          this.game.food.x === segment.x + 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 4;
          segment.frameY = 4;
        } else {
          segment.frameX = 6;
          segment.frameY = 3;
        }
      }
    } else if (index === this.segments.length - 1) {
      //tal
      if (prevSegment.y < segment.y) {
        segment.frameX = 1;
        segment.frameY = 4;
      } else if (prevSegment.y > segment.y) {
        segment.frameX = 0;
        segment.frameY = 2;
      } else if (prevSegment.x < segment.x) {
        segment.frameX = 2;
        segment.frameY = 0;
      } else if (prevSegment.x > segment.x) {
        segment.frameX = 0;
        segment.frameY = 1;
      }
    } else {
      //body
      if (nextSegment.x < segment.x && prevSegment.x > segment.x) {
        segment.frameX = 1;
        segment.frameY = 1;
      } else if (nextSegment.x > segment.x && prevSegment.x < segment.x) {
        segment.frameX = 1;
        segment.frameY = 0;
      } else if (nextSegment.y > segment.y && prevSegment.y < segment.y) {
        segment.frameX = 1;
        segment.frameY = 3;
      } else if (nextSegment.y < segment.y && prevSegment.y > segment.y) {
        segment.frameX = 0;
        segment.frameY = 3;
        //corners counter clockwise
      } else if (prevSegment.x < segment.x && nextSegment.y > segment.y) {
        segment.frameX = 4;
        segment.frameY = 0;
      } else if (prevSegment.y > segment.y && nextSegment.x > segment.x) {
        segment.frameX = 3;
        segment.frameY = 0;
      } else if (prevSegment.x > segment.x && nextSegment.y < segment.y) {
        segment.frameX = 3;
        segment.frameY = 1;
      } else if (prevSegment.y < segment.y && nextSegment.x < segment.x) {
        segment.frameX = 4;
        segment.frameY = 1;
        //corners clockwise
      } else if (nextSegment.x < segment.x && prevSegment.y > segment.y) {
        segment.frameX = 3;
        segment.frameY = 2;
      } else if (nextSegment.y < segment.y && prevSegment.x < segment.x) {
        segment.frameX = 3;
        segment.frameY = 3;
      } else if (nextSegment.x > segment.x && prevSegment.y < segment.y) {
        segment.frameX = 2;
        segment.frameY = 3;
      } else if (nextSegment.y > segment.y && prevSegment.x > segment.x) {
        segment.frameX = 2;
        segment.frameY = 2;
      } else {
        // segment.frameX = 6;
        // segment.frameY = 0;
      }
    }
  }
}

class KeyBoard2 extends Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "w") {
        this.turnUp();
        this.isMoving = true;
      }
      if (e.key.toLowerCase() === "s") {
        this.turnDown();
        this.isMoving = true;
      }
      if (e.key.toLowerCase() === "a") {
        this.turnLeft();
        this.isMoving = true;
      }
      if (e.key.toLowerCase() === "d") {
        this.turnRight();
        this.isMoving = true;
      }
    });
  }
}

class ComputerAI extends Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);
    this.turnTimer = 0;
    //difficulty
    this.difficulty = document.getElementById("difficulty").value;
    this.turnInterval = Math.floor(Math.random() * this.difficulty);
  }
  update() {
    super.update();
    if (
      (this.x === this.game.food.x && this.speedY === 0) ||
      (this.y === this.game.food.y && this.speedX === 0)
    ) {
      this.turn();
    } else {
      if (this.turnTimer < this.turnInterval) {
        this.turnTimer += 1;
      } else {
        this.turnTimer = 0;
        this.turn();
        this.turnInterval = Math.floor(Math.random() * 8) + 1;
      }
    }
  }
  turn() {
    //do not turn when moving towards food
    const food = this.game.food;
    if (food.x === this.x && food.y < this.y && this.speedY < 0) return;
    else if (food.x === this.x && food.y > this.y && this.speedY > 0) return;
    else if (food.y === this.y && food.x < this.x && this.speedX < 0) return;
    else if (food.y === this.y && food.x > this.x && this.speedX > 0) return;

    if (food.x < this.x && this.speedX === 0) {
      this.turnLeft();
    } else if (food.x > this.x && this.speedX === 0) {
      this.turnRight();
    } else if (food.y < this.y && this.speedY === 0) {
      this.turnUp();
    } else if (food.y > this.y && this.speedY === 0) {
      this.turnDown();
    } else {
      if (this.speedY === 0) {
        Math.random > 0.5 ? this.turnUp() : this.turnDown();
      } else if (this.speedX === 0) {
        Math.random > 0.5 ? this.turnLeft() : this.turnRight();
      }
    }
  }
}
