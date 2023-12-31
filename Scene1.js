class Scene1 extends Phaser.Scene {
  constructor() {
    super(`bootGame`);
  }

  preload() {
    this.load.image(`background`, `assets/images/BouncerSimTitleBackground.png`);
    this.load.image(`player`, `assets/images/bigmanallen.png`);
    this.load.image(`ball`, `assets/images/ball.png`);
    this.load.image(`goldball`, `assets/images/goldball.png`);
    this.load.image(`invisible wall`, `assets/images/invisible wall.png`);
  }

  create() {
    this.add.image(0, 0, `background`).setOrigin(0, 0);

    this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      `Instructions:\n\nUse arrow keys to move.\nAllow all of the adults into the bar, bounce all of the babies out!`,
      {
        font: `20px Arial`,
        fill: `#ffffff`,
        align: `center`
      }
    ).setOrigin(0.5);

    //start button
    const startButton = this.add.text(
      this.game.config.width / 2,
      this.game.config.height - 100,
      `Start Game`,
      {
        font: `30px Arial`,
        fill: `#ffffff`,
        align: `center`
      }
    ).setOrigin(0.5);
    startButton.setInteractive();
    startButton.on(`pointerdown`, () => {
      this.scene.start(`bootGame`);
    });

    startButton.on(`pointerover`, () => {
      startButton.setStyle({ fill: `#ff0` });
    });

    startButton.on(`pointerout`, () => {
      startButton.setStyle({ fill: `#ffffff` });
    });
  }
}
