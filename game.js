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
    this.load.image(`entrance`, `assets/images/invisible-wall.png`);
    this.load.image(`exit`, `assets/images/invisible-wall.png`);
  }

  // create ----------------

  create() {
    this.background = this.add.image(0, 0, `background`);
    this.background.setOrigin(0, 0);

    this.repImage = this.add.image(120, 21, `rep5`);
    this.repImage.setScale(1.2);

    this.player = this.physics.add.sprite(400, 350, `player`);
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

    // update rep image
    this.updateRepImage();

    //repeat
    const repeatInterval = 5000;

    const createBabysAndDrunks = function () {
      this.createBabys();
      this.createDrunks();
    };

    this.time.addEvent({
      delay: repeatInterval,
      callback: createBabysAndDrunks,
      callbackScope: this,
      loop: true,
    });

    // Player and Entrance and Exit collision
    this.physics.add.overlap(this.player, this.entrance);
    this.physics.add.collider(this.player, this.exit, null, null, this);

    // Score
    this.score = 0;
    let style = { font: `30px Arial`, fill: `#000` };
    this.scoreText = this.add.text(600, 5, `Score: ` + this.score, style);

    // Reputation
    this.reputation = 5;

    this.arrow = this.input.keyboard.createCursorKeys();

    // buttons for pausing and ending the game
    this.createButtons();
  }

  // create ---------------------------------


  // Create Drunks
  createDrunks() {
    this.drunks = this.physics.add.group({
      key: `drunk`,
      repeat: 2,
      setXY: { x: 100, y: 300, stepX: 200 },
    });

    this.drunks.children.iterate((drunk) => {
      drunk.setCollideWorldBounds(true);
      drunk.setBounce(1);
      drunk.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));

      this.physics.add.collider(drunk, this.entrance, this.destroyDrunk, null, this);
      this.physics.add.collider(drunk, this.exit, this.destroyDrunkExit, null, this);
    });
  }

  // Create Babys
  createBabys() {
    this.babys = this.physics.add.group({
      key: `baby`,
      repeat: 1,
      setXY: { x: 100, y: 300, stepX: 200 },
    });

    this.babys.children.iterate((baby) => {
      baby.setCollideWorldBounds(true);
      baby.setBounce(1);
      baby.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));

      this.physics.add.collider(baby, this.entrance, this.destroyBaby, null, this);
      this.physics.add.collider(baby, this.exit, this.destroyBabyExit, null, this);
    });
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
      10,
      `Pause`,
      buttonStyle
    );
    this.pauseButton.setInteractive();
    this.pauseButton.on(`pointerdown`, this.pauseGame, this);

    // Resume button (hidden initially)
    this.resumeButton = this.add.text(
      this.sys.game.config.width - 540,
      10,
      `Resume`,
      buttonStyle
    );
    this.resumeButton.setInteractive();
    this.resumeButton.visible = false;
    this.resumeButton.on(`pointerdown`, this.resumeGame, this);

    // End button
    this.endButton = this.add.text(
      this.sys.game.config.width - 400,
      10,
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
  }

  resumeGame() {
    this.physics.resume();
    this.arrow.enabled = true;
    this.pauseButton.visible = true;
    this.resumeButton.visible = false;
  }


  // update -----------------------

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
      this.player.setVelocityX(300);
    } else if (this.arrow.left.isDown) {
      this.player.setVelocityX(-300);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.arrow.down.isDown) {
      this.player.setVelocityY(300);
    } else if (this.arrow.up.isDown) {
      this.player.setVelocityY(-300);
    } else {
      this.player.setVelocityY(0);
    }
  }

  // update -----------------------


  hit(player, sprite) {
    const angle = Phaser.Math.Angle.Between(player.x, player.y, sprite.x, sprite.y);
    const velocityMagnitude = 400;
    sprite.setVelocity(velocityMagnitude * Math.cos(angle), velocityMagnitude * Math.sin(angle));
  }

  // Destroy drunk
  destroyDrunk(drunk, entrance) {
    if (entrance === this.entrance) {
      drunk.destroy();
      this.score += 10;
      this.scoreText.setText(`Score: ` + this.score);
    }
  }

  // Destroy drunk exit
  destroyDrunkExit(drunk, exit) {
    if (exit === this.exit) {
      drunk.destroy();
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


  gameOver() {
    this.physics.pause();
    let finalScoreText = this.add.text(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      `YOU'RE FIRED`,
      `Final Score: ` + this.score,
      { font: `32px Arial`, fill: `#fff`, align: `center` }
    );
    finalScoreText.setOrigin(0.5);
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