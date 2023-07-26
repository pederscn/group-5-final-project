class MainScene extends Phaser.Scene {
  preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('player', 'assets/images/bigmanallen.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('goldball', 'assets/images/goldball.png');
    this.load.image('invisible wall', 'assets/images/invisible wall.png');
  }

  create() {
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);

    this.player = this.physics.add.sprite(400, 350, 'player');
    this.player.setCollideWorldBounds(true);

    // Invisible wall physics
    this.walls = this.physics.add.group();
    this.invisibleWall = this.physics.add.sprite(106, 449, 'invisible wall');
    this.walls.add(this.invisibleWall);
    this.invisibleWall2 = this.physics.add.sprite(694, 449, 'invisible wall');
    this.walls.add(this.invisibleWall2);

    // Setting walls as immovable
    this.walls.getChildren().forEach((wall) => {
      wall.setImmovable(true);
    });

    this.balls = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
      let ball = this.balls.create(0, 0, 'ball');
      ball.setCollideWorldBounds(true);
      ball.setBounce(1);
      ball.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    }

    // Invisible wall collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.balls, this.walls);
    this.physics.add.collider(this.player, this.balls);

    this.score = 0;
    let style = { font: '20px Arial', fill: '#fff' };
    this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

    this.timerText = this.add.text(600, 20, '1:00', style);
    this.initialTime = 60;
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    this.arrow = this.input.keyboard.createCursorKeys();

    // Create buttons for pausing and ending the game
    this.createButtons();
  }

  createButtons() {
    // Button styles
    const buttonStyle = {
      font: '24px Arial',
      fill: '#fff',
      backgroundColor: '#333333', // Dark gray background color
      padding: {
        x: 10,
        y: 5,
      },
      borderRadius: 10, // Rounded corners
    };

    // Pause button
    this.pauseButton = this.add.text(
      this.sys.game.config.width - 540,
      10,
      'Pause',
      buttonStyle
    );
    this.pauseButton.setInteractive();
    this.pauseButton.on('pointerdown', this.pauseGame, this);

    // Resume button (hidden initially)
    this.resumeButton = this.add.text(
      this.sys.game.config.width - 540,
      10,
      'Resume',
      buttonStyle
    );
    this.resumeButton.setInteractive();
    this.resumeButton.visible = false;
    this.resumeButton.on('pointerdown', this.resumeGame, this);

    // End button
    this.endButton = this.add.text(
      this.sys.game.config.width - 400,
      10,
      'End Game',
      buttonStyle
    );
    this.endButton.setInteractive();
    this.endButton.on('pointerdown', this.gameOver, this);
  }

  pauseGame() {
    this.physics.pause();
    this.timer.paused = true;
    this.arrow.enabled = false; // Disable arrow key input
    this.player.setVelocity(0, 0);

    this.pauseButton.visible = false;
    this.resumeButton.visible = true;
  }

  resumeGame() {
    this.physics.resume();
    this.timer.paused = false;
    this.arrow.enabled = true; // Enable arrow key input

    this.pauseButton.visible = true;
    this.resumeButton.visible = false;
  }

  update() {
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
    let minutes = Math.floor(this.initialTime / 60).toString().padStart(2, '0');
    let seconds = (this.initialTime % 60).toString().padStart(2, '0');
    this.timerText.setText(minutes + ':' + seconds);

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
    this.timerText.setText('Game Over');
    let finalScoreText = this.add.text(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      'Final Score: ' + this.score,
      { font: '32px Arial', fill: '#fff', align: 'center' }
    );
    finalScoreText.setOrigin(0.5);
  }
}

let config = {
  width: 800, // Width of the game in pixels
  height: 500, // Height of the game in pixels
  backgroundColor: '#3498db', // The background color (blue)
  scene: MainScene, // The name of the scene we created
  physics: { default: 'arcade' }, // The physics engine to use
  parent: 'game', // Create the game inside the <div id="game">
};

let game = new Phaser.Game(config);
