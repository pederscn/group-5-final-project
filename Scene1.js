class Scene1 extends Phaser.Scene {
  constructor() {
    super(`bootGame`);
  }

  preload() {
    this.load.image(`background`, `assets/images/background.png`);
    this.load.image(`player`, `assets/images/bigmanallen.png`);
    this.load.image(`ball`, `assets/images/ball.png`);
    this.load.image(`goldball`, `assets/images/goldball.png`);
    this.load.image(`invisible wall`, `assets/images/invisible wall.png`);
  }

  create() {
    // title screen stuff goes here maybe??
  }
}