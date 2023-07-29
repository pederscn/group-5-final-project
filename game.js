class MainScene extends Phaser.Scene {
  preload() {
    this.load.image(`background`, `assets/images/background.png`);
    this.load.image(`rep0`, `assets/images/rep 0.png`);
    this.load.image(`rep1`, `assets/images/rep 1.png`);
    this.load.image(`rep2`, `assets/images/rep 2.png`);
    this.load.image(`rep3`, `assets/images/rep 3.png`);
    this.load.image(`rep4`, `assets/images/rep 4.png`);
    this.load.image(`rep5`, `assets/images/rep 5.png`);
    this.load.image(`player`, `assets/images/player.png`);
    this.load.image(`drunk`, `assets/images/DrunkGuy2.png`);
    this.load.image(`baby`, `assets/images/baby.png`);
    this.load.image(`ladiesnight`, `assets/images/ladiesnight.png`);
    this.load.image(`woman`, `assets/images/woman.png`);
    this.load.image(`entrance`, `assets/images/invisible-wall.png`);
    this.load.image(`exit`, `assets/images/invisible-wall.png`);
    this.load.image(`fired`, `assets/images/fired.gif`);
  }

  // Counter for every 4th baby spawned
  constructor() {
    super();
    // Other constructor code
    this.createBabysCounter = 0;
  }

  // create -----------------------------------

  create() {
    this.background = this.add.image(0, 0, `background`);
    this.background.setOrigin(0, 0);

    this.repImage = this.add.image(120, 21, `rep5`);
    this.repImage.setScale(0.6);
    this.repImage.setDepth(10);

    this.player = this.physics.add.sprite(400, 400, `player`);
    this.player.setCollideWorldBounds(true);

    //entrance wall
    this.entrance = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height - 5,
      `entrance`
    );
    this.entrance.setImmovable(true);
    this.entrance.displayWidth += 150;

    //exit wall
    this.exit = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      -50,
      `exit`
    );
    this.exit.setImmovable(true);
    this.exit.displayWidth += 600;

    // highlight Wall
    const graphics = this.add.graphics();
    const highlightColor = 0x0000ff;
    const highlightAlpha = 0.5;
    graphics.lineStyle(5, highlightColor, highlightAlpha);
    graphics.strokeRect(
      this.entrance.x - this.entrance.displayWidth / 2,
      this.entrance.y - this.entrance.height / 2,
      this.entrance.displayWidth,
      this.entrance.height
    );

    //create drunks
    this.createDrunks();

    //create babys
    this.createBabys();

    /*
    //create babys event
    this.createBabysEvent = this.time.addEvent({
      delay: Phaser.Math.Between(5000, 10000),
      callback: this.createBabys,
      callbackScope: this,
      loop: true,
      paused: false,
    });

    //create drunks
    this.createDrunksEvent = this.time.addEvent({
      delay: Phaser.Math.Between(4000, 5000),
      callback: this.createDrunks,
      callbackScope: this,
      loop: true,
      paused: false,
    });
    */

    // update rep image
    this.updateRepImage();

    //repeat
    const repeatInterval = 5000;

    // Player and Entrance and Exit collision
    this.physics.add.overlap(this.player, this.entrance);
    this.physics.add.collider(this.player, this.exit, null, null, this);

    // Score
    this.score = 0;
    let style = { font: `30px Arial`, fill: `#000` };
    this.scoreText = this.add.text(600, 5, `Score: ` + this.score, style);
    this.scoreText.setDepth(10);

    // Reputation
    this.reputation = 5;

    this.arrow = this.input.keyboard.createCursorKeys();

    // buttons for pausing and ending the game
    this.createButtons();
  }


  // Sprite Spawns -----------------------------------

  // Create Drunks
  createDrunks() {
    this.drunks = this.physics.add.group();

    const numOfDrunks = Phaser.Math.Between(3, 6);

    for (let i = 0; i < numOfDrunks; i++) {
      const xPosition = Phaser.Math.Between(50, this.sys.game.config.width - 50);
      const yPosition = Phaser.Math.Between(100, 300);

      const drunk = this.drunks.create(xPosition, yPosition, `drunk`);
      drunk.setCollideWorldBounds(true);
      drunk.setBounce(0.8);
      drunk.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-50, 50));

      this.physics.add.collider(drunk, this.entrance, this.destroyDrunk, null, this);
      this.physics.add.collider(drunk, this.exit, this.destroyDrunkExit, null, this);
    }

    this.createDrunksEvent = this.time.addEvent({
      delay: Phaser.Math.Between(3000, 5000),
      callback: this.createDrunks,
      callbackScope: this,
      paused: false,
    });
  }

  // Create Babys
  createBabys() {
    this.babys = this.physics.add.group();

    const numOfBabys = Phaser.Math.Between(1, 2);

    for (let i = 0; i < numOfBabys; i++) {
      const xPosition = Phaser.Math.Between(50, this.sys.game.config.width - 50);
      const yPosition = Phaser.Math.Between(100, 300);

      const baby = this.babys.create(xPosition, yPosition, `baby`);
      baby.setCollideWorldBounds(true);
      baby.setBounce(0.8);
      baby.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-50, 50));

      this.physics.add.collider(baby, this.entrance, this.destroyBaby, null, this);
      this.physics.add.collider(baby, this.exit, this.destroyBabyExit, null, this);
    }

    // Increment the counter for createBabys
    this.createBabysCounter++;

    // Check if the counter is a multiple of 4 (every 4th time)
    if (this.createBabysCounter % 4 === 0) {
      this.createLadiesNight();
    }

    this.createBabysEvent = this.time.addEvent({
      delay: Phaser.Math.Between(5000, 10000),
      callback: this.createBabys,
      callbackScope: this,
      paused: false,
    });
  }

  // Create Ladies Night
  createLadiesNight() {
    const xPosition = Phaser.Math.Between(50, this.sys.game.config.width - 50);
    const yPosition = Phaser.Math.Between(100, 300);

    const ladiesnight = this.physics.add.sprite(xPosition, yPosition, 'ladiesnight');
    ladiesnight.setCollideWorldBounds(true);
    ladiesnight.setBounce(0.8);
    ladiesnight.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-50, 50));

    this.physics.add.collider(ladiesnight, this.entrance, this.destroyLadiesNight, null, this);
    this.physics.add.collider(ladiesnight, this.exit, this.destroyLadiesNightExit, null, this);
    this.physics.add.collider(ladiesnight, this.player, this.collectLadiesNight, null, this);
  }

  // Create Woman
  createWoman() {
    this.womans = this.physics.add.group();

    const numOfWomans = 15;

    for (let i = 0; i < numOfWomans; i++) {
      const xPosition = Phaser.Math.Between(50, this.sys.game.config.width - 50);
      const yPosition = Phaser.Math.Between(100, 300);

      const woman = this.womans.create(xPosition, yPosition, `woman`);
      woman.setCollideWorldBounds(true);
      woman.setBounce(0.8);
      woman.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-50, 50));

      this.physics.add.collider(woman, this.entrance, this.destroyWoman, null, this);
      this.physics.add.collider(woman, this.exit, this.destroyWomanExit, null, this);
      this.physics.add.collider(woman, this.player, this.collectWoman, null, this);
    }
  }

  updateRepImage() {
    switch (this.reputation) {
      case 5:
        this.repImage.setTexture(`rep5`);
        break;
      case 4:
        this.repImage.setTexture(`rep4`);
        break;
      case 3:
        this.repImage.setTexture(`rep3`);
        break;
      case 2:
        this.repImage.setTexture(`rep2`);
        break;
      case 1:
        this.repImage.setTexture(`rep1`);
        break;
      case 0:
        this.repImage.setTexture(`rep0`);
    }
  }

  // Buttons -----------------------------------

  // Create Buttons
  createButtons() {
    const buttonStyle = {
      font: `24px Arial`,
      fill: `#fff`,
      backgroundColor: `#333333`,
      padding: {
        x: 10,
        y: 5,
      },
      borderRadius: 10,
    };

    // Pause button
    this.pauseButton = this.add.text(
      this.sys.game.config.width - 540,
      5,
      `Pause`,
      buttonStyle
    );
    this.pauseButton.setInteractive();
    this.pauseButton.on(`pointerdown`, this.pauseGame, this);

    // Resume button (hidden initially)
    this.resumeButton = this.add.text(
      this.sys.game.config.width - 540,
      5,
      `Resume`,
      buttonStyle
    );
    this.resumeButton.setInteractive();
    this.resumeButton.visible = false;
    this.resumeButton.on(`pointerdown`, this.resumeGame, this);

    // End button
    this.endButton = this.add.text(
      this.sys.game.config.width - 400,
      5,
      `End Game`,
      buttonStyle
    );
    this.endButton.setInteractive();
    this.endButton.on(`pointerdown`, this.gameOver, this);
  }

  pauseGame() {
    this.physics.pause();
    this.arrow.enabled = false;
    this.player.setVelocity(0, 0);
    this.pauseButton.visible = false;
    this.resumeButton.visible = true;

    this.createBabysEvent.paused = true;
    this.createDrunksEvent.paused = true;
  }

  resumeGame() {
    this.physics.resume();
    this.arrow.enabled = true;
    this.pauseButton.visible = true;
    this.resumeButton.visible = false;

    this.createBabysEvent.paused = false;
    this.createDrunksEvent.paused = false;
  }


  // update -----------------------------------

  update() {
    this.physics.world.wrap(this.drunks, 16);

    this.drunks.children.iterate((drunk) => {
      this.physics.add.collider(this.player, drunk, this.hit, null, this);
      this.physics.world.wrap(drunk, 16, false, true, false, false);
    });

    this.babys.children.iterate((baby) => {
      this.physics.add.collider(this.player, baby, this.hit, null, this);
      this.physics.world.wrap(baby, 16, false, true, false, false);
    });

    // Check for hitting the walls (including the entrance wall and exit wall)
    this.physics.world.collide(this.drunks, this.entrance);
    this.physics.world.collide(this.babys, this.entrance);
    this.physics.world.collide(this.drunks, this.exit, this.destroyDrunkExit, null, this);
    this.physics.world.collide(this.babys, this.exit, this.destroyBabyExit, null, this);

    if (this.arrow.right.isDown) {
      this.player.setVelocityX(350);
    } else if (this.arrow.left.isDown) {
      this.player.setVelocityX(-350);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.arrow.down.isDown) {
      this.player.setVelocityY(350);
    } else if (this.arrow.up.isDown) {
      this.player.setVelocityY(-350);
    } else {
      this.player.setVelocityY(0);
    }
  }


  hit(player, sprite) {
    const angle = Phaser.Math.Angle.Between(player.x, player.y, sprite.x, sprite.y);
    const velocityMagnitude = 400;
    sprite.setVelocity(velocityMagnitude * Math.cos(angle), velocityMagnitude * Math.sin(angle));
  }

  // Destroys -----------------------------------

  // Destroy drunk
  destroyDrunk(drunk, entrance) {
    if (entrance === this.entrance) {
      drunk.destroy();
      this.score += 125;
      this.scoreText.setText(`Score: ` + this.score);
    }
  }

  // Destroy drunk exit
  destroyDrunkExit(drunk, exit) {
    if (exit === this.exit) {
      drunk.destroy();
      this.score -= 5;
    }
  }

  // Destroy baby
  destroyBaby(baby, entrance) {
    if (entrance === this.entrance) {
      baby.destroy();
      this.score -= 10;
      this.scoreText.setText(`Score: ` + this.score);

      this.reputation--;
      this.updateRepImage();
      if (this.reputation === 0) {
        this.gameOver();
      }
    }
  }

  // Destroy baby exit
  destroyBabyExit(baby, exit) {
    if (exit === this.exit) {
      baby.destroy();
    }
  }

  // Destroy ladiesnight
  destroyLadiesNight(ladiesnight, entrance) {
    if (entrance === this.entrance) {
      ladiesnight.destroy();

      const flashDuration = 500;
      const totalFlashDuration = 13000;
      const flashColors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ff00ff',
        '#ffff00',
        '#00ffff',
      ];

      let currentIndex = 0;
      let elapsedTime = 0;

      const changeBackgroundColor = () => {
        document.body.style.backgroundColor = flashColors[currentIndex];

        currentIndex++;
        if (currentIndex >= flashColors.length) {
          currentIndex = 0;
        }

        elapsedTime += flashDuration;
        if (elapsedTime >= totalFlashDuration) {
          clearInterval(this.backgroundInterval);
          document.body.style.backgroundColor = '';
        }
      };

      this.backgroundInterval = setInterval(changeBackgroundColor, flashDuration);
    }
  }



  // Destroy ladiesnight exit
  destroyLadiesNightExit(ladiesnight, exit) {
    if (exit === this.exit) {
      ladiesnight.destroy();
    }
  }


  gameOver() {
    this.physics.pause();
    this.scoreText.destroy();

    this.createBabysEvent.remove();
    this.createDrunksEvent.remove();

    const firedGif = this.add.image(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2 - 35,
      `fired`
    );
    firedGif.setOrigin(0.5);
    firedGif.setDepth(10);
    let finalScoreText = this.add.text(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2 + 15,
      `Final Score: ` + this.score,
      { font: `40px Arial`, fill: `#fff`, align: `center` }
    );
    finalScoreText.setOrigin(0.5);
    finalScoreText.setDepth(10);
  }
}

let config = {
  width: 800, // Width of the game in pixels
  height: 500, // Height of the game in pixels
  backgroundColor: `#3498db`, // The background color (blue)
  scene: MainScene, // The name of the scene we created
  physics: { default: `arcade` }, // The physics engine to use
  parent: `game`, // Create the game inside the <div id="game">
};

let game = new Phaser.Game(config);