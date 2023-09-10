export class Hitbox extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height ) {
        const hitboxX = x 
        const hitboxY = y 
        super(scene, hitboxX, hitboxY, width, height, 0xff0000, 0);

        scene.add.existing(this)
        
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
    }
}
