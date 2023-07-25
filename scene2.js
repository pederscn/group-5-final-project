class Scene2 extends Phaser.Scene {
  constructor() {
    super('scene2');
  }

  preload() {
    this.load.spritesheet('beam', 'resources/Assets/Beam.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('explosion', 'resources/Assets/Explosion.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    // Add scene 2 specific logic here
  }

  update() {
    // Add scene 2 specific logic here
  }
}
