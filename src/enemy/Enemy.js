import { StateMachine, State } from '../lib/StateMachine.js'
import { Hitbox } from '../util/Hitbox.js'
import { StatusBar } from '../util/statusBar.js'
import { Sword } from './Sword.js'

let RUN_SPEED = 200
const JUMP_SPEED = 650
let ROLL_SPEED = 245

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, direction, player, ground) {

        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.player = player
        this.ground = ground
        this.direction = direction;
        this.setSize(20, 35, true)
        this.setScale(3)
        this.setOffset(135, 90)
        this.isRolling = false
        this.isJumping = false
        this.isDead = false
        this.isAttacking = false
        this.checkHit
        this.budgetAeonia = false
        this.canAttack = null
        this.currentAttack = null
        this.currentState = null
        this.nextState = null
        this.createUtils()
    }


    checkFlip() {
        if (this.player.body.x - this.body.x > 0) {
            this.flipX = false
            this.direction = 'right'
        } else {
            this.flipX = true
            this.direction = 'left'
        }
    }

    createUtils() {
        this.attackBox = new Hitbox(this.scene, 800, 200, 150, 150)
        this.healthBar = new StatusBar(this.scene, 'enemy', 850, 60, 500, 30, 100, 100);
    }

    createSwords(count) {

        const swordPositions = [
            { x: 100, y: 100, rotation: 180 },
            { x: 224, y: 100, rotation: 180 },
            { x: 348, y: 100, rotation: 180 },
            { x: 472, y: 100, rotation: 180 },
            { x: 596, y: 100, rotation: 180 },
            { x: 720, y: 100, rotation: 180 },
            { x: 844, y: 100, rotation: 180 },
            { x: 968, y: 100, rotation: 180 },
            { x: 1092, y: 100, rotation: 180 },
            { x: 1216, y: 100, rotation: 180 },
            { x: 1340, y: 100, rotation: 180 },
        ];

        this.swords = [];

        for (let i = 0; i < swordPositions.length - count; i++) {
            const { x, y, rotation } = swordPositions[i];
            const sword = new Sword(this.scene, x, y, 'sword', rotation, this.ground, this.player);
            this.scene.physics.add.collider(sword, this.ground, (sword) => this.onGroundCollision(sword))
            this.scene.physics.add.collider(sword, this.player, (sword) => this.onPlayerCollision(sword))
            this.swords.push(sword);
        }
    }

    onGroundCollision(sword) {
        sword.destroy()
    }

    onPlayerCollision(sword) {
        this.player.swordHit = true
        sword.destroy()
    }

    updateAttackBox(attack, direction) {
        let attackFrameOffset = { x: 0, y: 0 };
        let newAttackBoxX
        let newAttackBoxY
        let newScaleX = 1
        let newScaleY = 1

        switch (attack) {

            case 'eattack1':
                this.currentAttack = 'eattack1'
                attackFrameOffset.x = -5
                newScaleX = 0.8
                newScaleY = 0.4
                break

            case 'eattack2':
                this.currentAttack = 'eattack2'
                attackFrameOffset.x = -5
                newScaleX = 0.8
                newScaleY = 0.4
                break
            case 'eattack3':
                this.currentAttack = 'eattack3'
                attackFrameOffset.x = 20
                newScaleX = 1
                newScaleY = 1
                break

            case 'espattack':
                this.currentAttack = 'espattack'
                attackFrameOffset.x = -70
                attackFrameOffset.y = 25
                newScaleX = 3.3
                newScaleY = 0.7
                break
        }

        if (direction === 'left') {
            newAttackBoxX = this.x - attackFrameOffset.x - 70;
            newAttackBoxY = this.y + attackFrameOffset.y + 100
        } else if (direction === 'right') {
            newAttackBoxX = this.x + attackFrameOffset.x + 70;
            newAttackBoxY = this.y + attackFrameOffset.y + 100
        }

        this.attackBox.setPosition(newAttackBoxX, newAttackBoxY);
        this.attackBox.setScale(newScaleX, newScaleY)
    }

    decreaseHealth(attack) {
        switch (attack) {
            case 'attack':
                this.healthBar.decreaseHealth(5)
                break
            case 'spattack':
                this.healthBar.decreaseHealth(17.5)
                break
        }
        if (this.healthBar.healthValue <= 0) {
            this.isDead = true
        }
    }
}


export class EMainState extends State {
    constructor(player) {
        super();
        this.player = player;
        this.moveDelayCall = false
        this.phase1 = false
        this.phase2 = false
    }

    enter(scene, enemy, player) {
        enemy.setVelocityX(0)
        enemy.anims.play('eidle', true);
        enemy.scene.physics.add.overlap(enemy, player.attackBox, this.onAttackCollision, null, this)
    }

    execute(scene, enemy, player) {

        enemy.checkFlip()

        if (enemy.isDead) {
            this.stateMachine.transition('edeath')
            return
        }

        if (!this.phase2 && enemy.healthBar.healthValue < 60 && !enemy.isRolling) {
            RUN_SPEED += 15
            ROLL_SPEED += 25
            this.phase2 = true
            enemy.budgetAeonia = true
            this.stateMachine.transition('edefend')
            return
        }

        if (!this.phase3 && enemy.healthBar.healthValue < 30 && !enemy.isRolling) {
            RUN_SPEED += 25
            this.phase3 = true
            enemy.placeholder = true
            this.stateMachine.transition('edefend')
            return
        }

        if (!this.moveDelayCall) {
            enemy.scene.time.delayedCall(250, () => {
                this.stateMachine.transition('emove')
                this.moveDelayCall = false
            })
            this.moveDelayCall = true
        }
    }

    onAttackCollision(enemy, attackBox) {
        if (this.player.isAttacking && !enemy.isRolling) {
            this.stateMachine.transition('ehurt')
            return
        }
    }
}

export class EMoveState extends State {

    constructor(player) {
        super();
        this.player = player;
        this.dodgeDelayCall = false
        this.jumpDelayCall = false
        this.randomAttack = ''
    }

    enter(scene, enemy, player) {
        const attacks = ['eattack1', 'eattack2', 'eattack3', 'espattack', 'espattack']
        this.dodgeDelayCall = false
        this.jumpDelayCall = false
        if (!enemy.budgetAeonia) {
            this.randomAttack = attacks[Math.floor(Math.random() * (attacks.length - 2))]
        } else {
            this.randomAttack = attacks[Math.floor(Math.random() * (attacks.length))]
        }

        enemy.anims.play('erun', true)
        enemy.scene.physics.add.overlap(enemy, player.attackBox, this.onAttackCollision, null, this)

        if (!this.dodgeDelayCall && enemy.body.onFloor()) {
            enemy.scene.time.delayedCall(2000, () => {
                this.stateMachine.transition('eroll')
                this.dodgeDelayCall = true
            })
            return
        }

        if (!this.jumpDelayCall) {
            enemy.scene.time.delayedCall(5000, () => {
                this.stateMachine.transition('ejump')
                this.jumpDelayCall = true
            })
            return
        }
    }


    execute(scene, enemy, player) {
        enemy.checkFlip()

        if (enemy.isDead) {
            this.stateMachine.transition('edeath')
            return
        }

        if (enemy.direction === 'left') {
            enemy.setVelocityX(-RUN_SPEED);

        } else if (enemy.direction === 'right') {
            enemy.setVelocityX(RUN_SPEED);
        }


        switch (enemy.direction) {
            case 'left':
                if (enemy.body.x - 165 < player.body.x && !enemy.isRolling) {
                    this.stateMachine.transition(this.randomAttack)
                    return
                }
                break
            case 'right':
                if (enemy.body.x + 165 > player.body.x && !enemy.isRolling) {
                    this.stateMachine.transition(this.randomAttack)
                    return
                }
                break
        }

    }

    onAttackCollision(enemy, attackBox) {
        if (this.player.isAttacking && !enemy.isRolling) {
            this.stateMachine.transition('ehurt')
            return
        }
    }

}

export class ERollState extends State {

    enter(scene, enemy) {
        const rollSpeed = enemy.direction === 'left' ? -ROLL_SPEED : ROLL_SPEED;
        enemy.setVelocityX(rollSpeed)
        enemy.isRolling = false
        enemy.anims.play('eroll', false);
    }

    execute(scene, enemy) {

        if (enemy.isDead) {
            this.stateMachine.transition('edeath')
            return
        }

        const currentFrameIndex = enemy.anims.currentFrame.index;

        if (currentFrameIndex >= 2 && currentFrameIndex <= 6) {
            enemy.isRolling = true
            return
        }

        if (currentFrameIndex > 6) {
            enemy.isRolling = false
            return
        }

        enemy.once('animationcomplete', () => {
            enemy.isRolling = false
            this.stateMachine.transition('emain');
        });
    }
}

export class EAttack1State extends State {
    enter(scene, enemy) {
        const direction = enemy.direction
        enemy.currentAttack = 'eattack1'
        enemy.setVelocity(0)
        enemy.updateAttackBox(enemy.currentAttack, direction)
        enemy.anims.play('eattack1', false);
        enemy.isAttacking = false
    }


    execute(scene, enemy) {

        if (enemy.isDead) {
            this.stateMachine.transition('edeath')
        }

        const currentFrameIndex = enemy.anims.currentFrame.index;

        if (currentFrameIndex >= 2 && currentFrameIndex <= 3 && !enemy.checkHit) {
            enemy.checkHit = true
            enemy.isAttacking = true
            return
        }

        enemy.once('animationcomplete', () => {
            enemy.isAttacking = false
            enemy.checkHit = false
            this.stateMachine.transition('emain')
        });

    }

}

export class EAttack2State extends State {
    enter(scene, enemy) {
        const direction = enemy.direction
        enemy.currentAttack = 'eattack2'
        enemy.setVelocity(0)
        enemy.updateAttackBox(enemy.currentAttack, direction)
        enemy.anims.play('eattack2', false);
        enemy.isAttacking = false
    }

    execute(scene, enemy) {

        if (enemy.isDead) {
            this.stateMachine.transition('edeath')
        }

        const currentFrameIndex = enemy.anims.currentFrame.index;

        if (currentFrameIndex >= 2 && currentFrameIndex <= 5 && !enemy.checkHit) {
            enemy.checkHit = true
            enemy.isAttacking = true
            return
        }

        if (currentFrameIndex > 5) {
            enemy.isAttacking = false
            return
        }

        enemy.once('animationcomplete', () => {
            enemy.isAttacking = false
            enemy.checkHit = false
            this.stateMachine.transition('emain')
        });

    }

}

export class EAttack3State extends State {
    enter(scene, enemy) {
        const direction = enemy.direction
        enemy.currentAttack = 'eattack3'
        enemy.setVelocity(0)
        enemy.updateAttackBox(enemy.currentAttack, direction)
        enemy.anims.play('eattack3', false);
        enemy.isAttacking = false
    }

    execute(scene, enemy) {

        if (enemy.isDead) {
            this.stateMachine.transition('edeath')
        }

        const currentFrameIndex = enemy.anims.currentFrame.index;

        if (currentFrameIndex >= 3 && currentFrameIndex <= 17 && !enemy.checkHit) {
            enemy.checkHit = true
            enemy.isAttacking = true
            return
        }

        if (currentFrameIndex > 17) {
            enemy.isAttacking = false
            return
        }

        enemy.once('animationcomplete', () => {
            enemy.isAttacking = false
            enemy.checkHit = false
            this.stateMachine.transition('emain')
        });
    }
}

export class ESPAttackState extends State {
    enter(scene, enemy) {

        if (!enemy.body.onFloor()) {
            this.stateMachine.transition('emain')
            return
        }

        enemy.tint = 0x0000ff;

        enemy.scene.time.delayedCall(350, () => {
            enemy.tint = 0xffffff;
            enemy.specialDelay = true
            const direction = enemy.direction
            enemy.currentAttack = 'espattack'
            enemy.setVelocity(0)
            enemy.updateAttackBox(enemy.currentAttack, direction)
            enemy.anims.play('espattack', false);
            enemy.isAttacking = false
        })

    }

    execute(scene, enemy) {
        if (enemy.specialDelay) {
            const currentFrameIndex = enemy.anims.currentFrame.index;

            if (currentFrameIndex >= 5 && currentFrameIndex <= 8 && enemy.body.onFloor() && !enemy.checkHit) {
                enemy.checkHit = true
                enemy.isAttacking = true
                return
            }

            if (currentFrameIndex > 8) {
                enemy.isAttacking = false
                return
            }

            enemy.once('animationcomplete', () => {
                enemy.isAttacking = false
                enemy.checkHit = false
                enemy.specialDelay = false
                this.stateMachine.transition('emain')
            });
        }

    }
}

export class EHurtState extends State {
    enter(scene, enemy, player) {
        enemy.tint = 0xF2F0DF;

        enemy.scene.time.delayedCall(100, () => {
            enemy.tint = 0xffffff;
        })

        enemy.setVelocity(0);
        enemy.anims.play('ehurt');

        if (player.isAttacking) {
            player.isAttacking = false
            enemy.decreaseHealth(player.currentAttack)
        }

        enemy.once('animationcomplete', () => {
            this.stateMachine.transition('emain');
        });
    }

    execute(scene, enemy) {
        if (enemy.isDead) {
            this.stateMachine.transition('edeath')
        }
    }
}

export class EJumpState extends State {

    enter(scene, enemy) {

        enemy.anims.play('ejump', false)
        enemy.body.velocity.y = (-JUMP_SPEED);

    }

    execute(scene, enemy) {

        enemy.checkFlip()

        if (enemy.direction === 'left') {
            enemy.setVelocityX(-RUN_SPEED);

        } else {
            enemy.setVelocityX(RUN_SPEED);
        }

        if (enemy.body.velocity.y > 0) {
            this.stateMachine.transition('efall');
        }
    }
}

export class EFallState extends State {
    enter(scene, enemy) {
        enemy.anims.play('efall', true);
    }

    execute(scene, enemy) {

        enemy.checkFlip()

        if (enemy.body.onFloor()) {
            this.stateMachine.transition('emain');
        }
    }
}

export class EDefendState extends State {
    enter(scene, enemy, player) {
        enemy.setVelocity(0);
        enemy.anims.play('edefend');
        enemy.createSwords(0)
    }

    execute(scene, enemy, player) {
        enemy.once('animationcomplete', () => {
            this.stateMachine.transition('emain');
        });
    }
}

export class EDeathState extends State {
    enter(scene, enemy) {
        enemy.setVelocity(0);
        enemy.anims.play('edeath');
        
        enemy.once('animationcomplete', () => {
            enemy.anims.stop()
        });
    }
}