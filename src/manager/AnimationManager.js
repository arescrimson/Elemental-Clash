/** 
 * Animation Manager which creates both player and enemy animations from preloaded json file. 
 */
export default class AnimationManager {
    constructor(scene) {
        this.scene = scene;
    }


    createBackgroundAnims() { 
        this.scene.anims.create({
            key: 'banim',
            frames: this.scene.anims.generateFrameNames('background1', { prefix: 'b', start: 1, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
    }

    createPlayerAnims() {
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', {start: 1, end: 8,}),
            frameRate: 13,
            repeat: -1
        });
        
        
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', {start: 9, end: 16,}),
            frameRate: 13,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: 'roll',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', {start: 51, end: 58,}),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', {start: 17, end: 19,}),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'fall',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', { start: 20, end: 22 }),
            frameRate: 13,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'attack',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', { start: 59, end:69 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'spattack',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', { start: 119, end:134 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'hurt',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', { start: 145, end: 150 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'death',
            frames: this.scene.anims.generateFrameNumbers('playerspritesheet', { start: 151, end: 163}),
            frameRate: 13,
            repeat: 0
        });   
    }

    createEnemyAnims() {
        this.scene.anims.create({
            key: 'eidle',
            frames: this.scene.anims.generateFrameNumbers('idle', { start: 0, end: 7 }),
            frameRate: 13,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'erun',
            frames: this.scene.anims.generateFrameNumbers('run', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'eroll',
            frames: this.scene.anims.generateFrameNumbers('roll', { start: 0, end: 6 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'ejump',
            frames: this.scene.anims.generateFrameNumbers('jump', { start: 0, end: 2 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'efall',
            frames: this.scene.anims.generateFrameNumbers('fall', { start: 0, end: 2 }),
            frameRate: 13,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'eattack1',
            frames: this.scene.anims.generateFrameNumbers('attack1', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'eattack2',
            frames: this.scene.anims.generateFrameNumbers('attack2', { start: 0, end: 7 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'eattack3',
            frames: this.scene.anims.generateFrameNumbers('attack3', { start: 0, end: 17 }),
            frameRate: 13,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'espattack',
            frames: this.scene.anims.generateFrameNumbers('spattack', { start: 0, end: 10 }),
            frameRate: 11,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'edefend',
            frames: this.scene.anims.generateFrameNumbers('defend', { start: 0, end: 11 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'ehurt',
            frames: this.scene.anims.generateFrameNumbers('hurt', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'edeath',
            frames: this.scene.anims.generateFrameNumbers('death', { start: 0, end: 11 }),
            frameRate: 13,
            repeat: 0
        });
    }
}
