class Scene2 extends Phaser.Scene {
  constructor() {
    super(`playGame`);
  }
  create() {
    this.background = this.add.image(0, 0, `background`);
    this.background.setOrigin(0, 0);

    this.player = this.physics.add.sprite(400, 350, `player`);
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

    for (let i = 0; i < 3; i++) {
      let ball = this.balls.create(0, 0, `ball`);
      ball.setCollideWorldBounds(true);
      ball.setBounce(1);
      ball.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    }


    //invisible wall collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.balls, this.walls);
    this.physics.add.collider(this.player, this.balls);

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


    this.physics.world.wrap(this.balls, 16);

    this.balls.children.iterate((ball) => {
      this.physics.add.collider(this.player, ball, this.hit, null, this);
      this.physics.world.wrap(ball, 16, false, true, false, false);
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

    this.player.setVelocity(0, 0);
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


  hit(player, ball) {

    const angle = Phaser.Math.Angle.Between(player.x, player.y, ball.x, ball.y);

    const velocityMagnitude = 500;
    ball.setVelocity(velocityMagnitude * Math.cos(angle), velocityMagnitude * Math.sin(angle));

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