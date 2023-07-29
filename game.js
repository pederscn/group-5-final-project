class MainScene extends Phaser.Scene {
 /* preload() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('player', 'assets/images/bigmanallen.png');
   // this.load.image('ball', 'assets/images/ball.png');
    // this.load.image('goldball', 'assets/images/goldball.png');
    this.load.image('invisible wall', 'assets/images/invisible wall.png');
    this.load.image('adult1', 'assets/images/freshman.png');
    this.load.image('adult2', 'assets/images/freshman2.png');
  }*/

  preload() {
    // Load assets for Scene2 (adults, babies, etc.)
    this.load.image('background', 'assets/images/background.png');
    this.load.image('player', 'assets/images/bigmanallen.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('goldball', 'assets/images/goldball.png');
    this.load.image('invisible wall', 'assets/images/invisible wall.png');
    
    // Load multiple adult images with different keys
    this.load.image('adult1', 'assets/images/freshman.png');
    this.load.image('adult2', 'assets/images/freshman2.png');
    // Add more images for other adult types if needed

    // Load the baby image
    this.load.image('baby', 'assets/images/baby.webp');
  }


  /*create() {
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
  } */

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
    this.walls.getChildren().forEach(wall => {
      wall.setImmovable(true);
    });

   // this.balls = this.physics.add.group();
    this.people = this.physics.add.group();
for (let i = 0; i < 3; i++) {
  let key = Phaser.Math.RND.pick(['adult1', 'adult2', 'baby']);
  let person = this.people.create(0, 0, key);
  person.setCollideWorldBounds(true);
  person.setBounce(1);
  person.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
}
    
 //this.people.setScale(-0.3);
    // Invisible wall collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.people, this.walls);
    this.physics.add.collider(this.player, this.people, this.hit, null, this);

    this.reputation = 5; // Initial reputation value
    this.score = 0;
    let style = { font: '20px Arial', fill: '#fff' };
    this.scoreText = this.add.text(20, 20, 'Score: ' + this.score, style);

    this.timerText = this.add.text(600, 20, '1:00', style);
    this.initialTime = 60;
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
   

    this.arrow = this.input.keyboard.createCursorKeys();

    // Spawn adults every 3-5 seconds
    this.spawnAdults();

    // Spawn a baby every 5-8 seconds
    this.spawnBaby();
    this.createButtons();
  }

  spawnAdults() {
    this.time.addEvent({
      delay: Phaser.Math.Between(3000, 5000),
      callback: () => {
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const y = -20; // Spawn just above the top boundary
        const randomAdultKey = Phaser.Math.RND.pick(['adult1', 'adult2']); // We can add more keys if needed
        const adult = this.people.create(x, y, randomAdultKey);
        adult.setScale(0.1);
        adult.setCollideWorldBounds(true);
        adult.setBounce(1);
        adult.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(200, 400));
        // Set velocity to fall down (negative Y velocity)
     // adult.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(200, 400));
      
        this.spawnAdults();
      },
      callbackScope: this,
    });
  }

  spawnBaby() {
    this.time.addEvent({
      delay: Phaser.Math.Between(5000, 8000),
      callback: () => {
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const y = -20; // Spawn just above the top boundary
        const baby = this.people.create(x, y, 'baby');
        baby.setScale(0.1);
        baby.setCollideWorldBounds(true);
        baby.setBounce(1);
        baby.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(200, 400));

        // Set velocity to fall down (negative Y velocity)
      //baby.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(200, 400));
      
        this.spawnBaby();


      },
      callbackScope: this,
    });
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

    // Resume button (hidden initially)
    this.resumeButton = this.add.text(
      this.sys.game.config.width - 540,
      10,
      'Resume',
      buttonStyle
    );
    this.resumeButton.setInteractive();
    this.resumeButton.visible = false; // Hide the button initially
    this.resumeButton.on('pointerdown', this.resumeGame, this);
  }

  pauseGame() {
    if (!this.isPaused && !this.gameOver) {
      this.isPaused = true;
      this.physics.pause();
      this.timer.paused = true;
      this.arrow.enabled = false; // Disable arrow key input
      this.player.setVelocity(0, 0);

      this.pauseButton.visible = false;
      this.resumeButton.visible = true; // Show the "Resume" button
    }
  }

  resumeGame() {
    if (this.isPaused) {
      this.isPaused = false;
      this.physics.resume();
      this.timer.paused = false;
      this.arrow.enabled = true; // Enable arrow key input

      this.pauseButton.visible = true;
      this.resumeButton.visible = false; // Hide the "Resume" button again

      if (this.gameOver) {
        // Reset game state if resuming after game over
        this.gameOver = false;
        this.score = 0;
        this.reputation = 5;
        this.scoreText.setText('Score: ' + this.score);
        this.timerText.setText('1:00');
        this.timer.paused = false;
        this.time.delayedCall(1000, () => {
          this.spawnAdults();
          this.spawnBaby();
        });
      }
    }
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
    // Disable top and bottom world boundary collision for people
    this.people.children.iterate((person) => {
      person.body.collideWorldBounds = false;
    });
  
    // Wrap only the 'people' group around the world
    this.physics.world.wrap(this.people, 16);
  
    // Handle collisions between player and people
    this.people.children.iterate((person) => {
      this.physics.add.collider(this.player, person, this.hit, null, this);
    });
  
    // Player movement with arrow keys
    if (this.arrow.right.isDown) {
      this.player.setVelocityX(160);
    } else if (this.arrow.left.isDown) {
      this.player.setVelocityX(-160);
    } else {
      this.player.setVelocityX(0);
    }
  
    if (this.arrow.down.isDown) {
      this.player.setVelocityY(160);
    } else if (this.arrow.up.isDown) {
      this.player.setVelocityY(-160);
    } else {
      this.player.setVelocityY(0);
    }
  }
  
  /*update() {
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
  } */

  /*updateTimer() {
    this.initialTime--;
    let minutes = Math.floor(this.initialTime / 60).toString().padStart(2, '0');
    let seconds = (this.initialTime % 60).toString().padStart(2, '0');
    this.timerText.setText(minutes + ':' + seconds);

    if (this.initialTime <= 0) {
      this.timer.paused = true;
      this.gameOver();
    }
  }*/

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

  /*hit(player, ball) {
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
}*/

hit(player, person) {
  if (person.texture.key === 'baby') {
    this.reputation--; // Reduce reputation if the person is a baby
  } else {
    this.score++; // Increase score if the person is an adult
  }

  // Destroy the person after the collision
  person.destroy();

  // Update score and reputation text
  this.scoreText.setText('Score: ' + this.score);

  // Check for game over
  if (this.reputation <= 0) {
    this.gameOver();
  }
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
