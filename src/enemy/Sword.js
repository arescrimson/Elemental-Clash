export class Sword extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, angle, ground, player) {
        super(scene, x, y, texture);

        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.ground = ground
        this.player = player
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
        this.body.setCollideWorldBounds(true);


        this.setAngle(angle)
        this.setScale(0.15, 0.25)
        this.setSize(60, 120, true)
        this.setOffset(120, 70)

        this.scene.time.delayedCall(750, () => {
            this.setVelocityY(700)
        })
        
    }
}
