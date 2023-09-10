export class StatusBar extends Phaser.GameObjects.Container {
  constructor(scene, id, x, y, width, height, initialValue, healthValue) {
    super(scene, x, y);
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.id = id
    this.maxValue = initialValue;
    this.healthValue = healthValue;

    const barS = scene.add.rectangle(-6.75, -6.75, 512.5, 42.5, 0x000000)
    barS.setOrigin(0).setAlpha(0.6)
    this.add(barS)
    if (this.id === 'player') {
      this.healthbar = scene.add.rectangle(0, 0, width, height, 0xFF4F00);
    } else {
      this.healthbar = scene.add.rectangle(0, 0, width, height, 0xC264FF);

    }
    this.healthbar.setOrigin(0).setAlpha(0.8);
    this.add(this.healthbar);
    scene.add.existing(this);
    this.update();
  }

  update() {

    if (this.id === 'player') {
      const healthBarWidth = (this.healthValue / this.maxValue) * this.width;
      this.healthbar.setSize(healthBarWidth, this.height);
    } else {
      const healthBarWidth = (this.healthValue / this.maxValue) * this.width;
      const healthBarX = this.width - healthBarWidth;
      this.healthbar.setPosition(healthBarX, 0);
      this.healthbar.setSize(healthBarWidth, this.height);
    }
  }

  decreaseHealth(amount) {
    if (this.healthValue > 0 && (this.healthValue - amount > 0)) {
      this.healthValue -= amount;
    } else {
      this.healthValue = 0
    }
    this.update()
  }

  increaseHealth(amount) {
    this.healthValue += amount;
    if (this.healthValue > this.maxValue) {
      this.healthValue = this.maxValue;
    }
    this.update();
  }
}
