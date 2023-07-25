class Scene1 extends Phaser.Scene {
  constructor() {
    super('scene1');
  }

  preload() {
    this.load.image('player', 'resources/Assets/User.png');
    this.load.image('enemy', 'resources/Assets/Enemy.png');
    this.load.image('bullet', 'resources/Assets/Beam.png');
  }

  create() {
    this.player = this.physics.add.sprite(400, 500, 'player').setScale(2);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group();
    for (let i = 0; i < 10; i++) {
      const enemy = this.enemies.create(100 + i * 80, 100, 'enemy').setScale(2);
      enemy.setVelocityX(Phaser.Math.Between(-200, 200));
    }

    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 20
    });

    this.physics.add.collider(this.bullets, this.enemies, this.bulletHitEnemy, null, this);
    this.physics.add.collider(this.player, this.enemies, this.playerHitEnemy, null, this);
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    }

    if (this.cursors.space.isDown) {
      this.fireBullet();
    }
  }

  fireBullet() {
    const bullet = this.bullets.get(this.player.x, this.player.y - 16);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setVelocityY(-400);
    }
  }

  bulletHitEnemy(bullet, enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
    enemy.disableBody(true, true);
  }

  playerHitEnemy(player, enemy) {
    this.physics.pause();
    player.setTint(0xff0000);
  }
}
