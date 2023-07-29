class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame'); // Use a unique key for this scene, e.g., 'playGame'
  }

  preload() {
    // Load assets for Scene2 (adults, babies, etc.)
    this.load.image('background', 'assets/images/BouncerSimTitleBackground.png');
    this.load.image('player', 'assets/images/bigmanallen.png');
   // this.load.image('ball', 'assets/images/ball.png');
    // this.load.image('goldball', 'assets/images/goldball.png');
    this.load.image('invisible wall', 'assets/images/invisible wall.png');
    
    // Load multiple adult images with different keys
    this.load.image('adult1', 'assets/images/freshman.png');
    this.load.image('adult2', 'assets/images/freshman2.png');
    // Add more images for other adult types if needed

    // Load the baby image
    this.load.image('baby', 'assets/images/baby.webp');
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
    this.walls.getChildren().forEach(wall => {
      wall.setImmovable(true);
    });

    this.balls = this.physics.add.group();
    this.people = this.physics.add.group();

    for (let i = 0; i < 3; i++) {
      let ball = this.balls.create(0, 0, 'ball'); // Use 'ball' as the key for balls (adjust if needed)
      ball.setCollideWorldBounds(true);
      ball.setBounce(1);
      ball.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
    }

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
  }

  spawnAdults() {
    this.time.addEvent({
      delay: Phaser.Math.Between(3000, 5000),
      callback: () => {
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const y = -20; // Spawn just above the top boundary
        const randomAdultKey = Phaser.Math.RND.pick(['adult1', 'adult2']); // We can add more keys if needed
        const adult = this.people.create(x, y, randomAdultKey);
        adult.setCollideWorldBounds(true);
        adult.setBounce(1);
        adult.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(200, 400));
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
        baby.setCollideWorldBounds(true);
        baby.setBounce(1);
        baby.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(200, 400));
        this.spawnBaby();
      },
      callbackScope: this,
    });
  }

  update() {
    // Disable top and bottom world boundary collision for people
    this.people.children.iterate((person) => {
      person.body.collideWorldBounds = false;
    });

    // Wrap balls and people around the world
    this.physics.world.wrap(this.balls, 16);
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