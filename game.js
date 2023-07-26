class mainScene {
  preload() {
    this.load.image(`background`, `assets/images/background.png`);
    this.load.image(`player`, `assets/images/bigmanallen.png`);
    this.load.image(`ball`, `assets/images/ball.png`);
    this.load.image(`goldball`, `assets/images/goldball.png`);
    this.load.image(`invisible wall`, `assets/images/invisible wall.png`);
  }
  create() {
    this.background = this.add.image(0, 0, `background`);
    this.background.setOrigin(0, 0);

    this.player = this.physics.add.sprite(100, 100, `player`);
    this.player.setCollideWorldBounds(true);

    //invisible wall physics
    this.walls = this.physics.add.group();

    this.invisibleWall = this.physics.add.sprite(106, 449, `invisible wall`);
    this.walls.add(this.invisibleWall);
    this.invisibleWall2 = this.physics.add.sprite(694, 449, `invisible wall`);
    this.walls.add(this.invisibleWall2);

    //setting walls as immovable
    this.walls.getChildren().forEach(wall => {
      wall.setImmovable(true);
    });


    this.balls = this.physics.add.group();

    //invisible wall collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.balls, this.walls);

    for (let i = 0; i < 3; i++) {
      let ball = this.balls.create(0, 0, `ball`);
      ball.setCollideWorldBounds(true);
      ball.setBounce(1);
      ball.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    }

    this.score = 0;
    let style = { font: `20px Arial`, fill: `#fff` };
    this.scoreText = this.add.text(20, 20, `score: ` + this.score, style);

    this.timerText = this.add.text(600, 20, `1:00`, style);
    this.initialTime = 60;
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.arrow = this.input.keyboard.createCursorKeys();
  }
  update() {
    let _this = this;

    this.balls.children.iterate(function (ball) {
      _this.physics.world.wrap(ball, 16);

      if (_this.physics.overlap(_this.player, ball)) {
        if (ball.texture.key === `goldball`) {
          _this.collectGoldBall(ball);
        } else {
          if (Phaser.Math.RND.frac() <= 0.1) {
            _this.spawnGoldBall();
          }
          _this.hit(_this.player, ball);
        }
      }
    });

    if (this.arrow.right.isDown) {
      this.player.x += 5;
    } else if (this.arrow.left.isDown) {
      this.player.x -= 5;
    }

    if (this.arrow.down.isDown) {
      this.player.y += 5;
    } else if (this.arrow.up.isDown) {
      this.player.y -= 5;
    }
  }

  updateTimer() {
    this.initialTime--;
    let minutes = Math.floor(this.initialTime / 60).toString().padStart(2, `0`);
    let seconds = (this.initialTime % 60).toString().padStart(2, `0`);
    this.timerText.setText(minutes + `:` + seconds);

    if (this.initialTime <= 0) {
      this.timer.paused = true;
      this.gameOver();
    }
  }

  spawnGoldBall() {
    let newX = Phaser.Math.Between(20, 680);
    let newY = Phaser.Math.Between(20, 380);
    let goldBall = this.balls.create(newX, newY, `goldball`);
    goldBall.setCollideWorldBounds(true);
    goldBall.setBounce(1);
    goldBall.setVelocity(Phaser.Math.Between(-400, 400), Phaser.Math.Between(-400, 400));
  }

  collectGoldBall(goldBall) {
    goldBall.disableBody(true, true);

    this.score += 300;
    this.scoreText.setText(`score: ` + this.score);

    let tween = this.tweens.add({
      targets: this.player,
      duration: 200,
      scaleX: 1.2,
      scaleY: 1.2,
      yoyo: true,
    });

    for (let i = 0; i < 3; i++) {
      let newX = Phaser.Math.Between(20, 680);
      let newY = Phaser.Math.Between(20, 380);
      let newBall = this.balls.create(newX, newY, `ball`);
      newBall.setCollideWorldBounds(true);
      newBall.setBounce(1);
      newBall.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    }
  }

  hit(player, ball) {
    ball.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`score: ` + this.score);

    let tween = this.tweens.add({
      targets: player,
      duration: 200,
      scaleX: 1.2,
      scaleY: 1.2,
      yoyo: true,
    });

    let newX = Phaser.Math.Between(20, 680);
    let newY = Phaser.Math.Between(20, 380);
    let newBall = this.balls.create(newX, newY, `ball`);
    newBall.setCollideWorldBounds(true);
    newBall.setBounce(1);
    newBall.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
  }

  gameOver() {
    this.physics.pause();
    this.timerText.setText(`Game Over`);
    let finalScoreText = this.add.text(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      `Final Score: ` + this.score,
      { font: `32px Arial`, fill: `#fff`, align: `center` }
    );
    finalScoreText.setOrigin(0.5);
  }
}


new Phaser.Game({
  width: 800, // Width of the game in pixels
  height: 500, // Height of the game in pixels
  backgroundColor: `#3498db`, // The background color (blue)
  scene: mainScene, // The name of the scene we created
  physics: { default: `arcade` }, // The physics engine to use
  parent: `game`, // Create the game inside the <div id="game"> 
});