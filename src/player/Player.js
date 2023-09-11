import { State } from '../lib/StateMachine.js'
import { Hitbox } from '../util/Hitbox.js'
import { StatusBar } from '../util/statusBar.js'

//Run, Jump, and Dodge Speeds. 
const RUN_SPEED = 260
const JUMP_SPEED = 650
const DODGE_SPEED = 285

export class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);
        //Adds player to scene and adds physics to body 
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        //Centers hitbox on player 
        this.setScale(3)
        this.setSize(20, 35, true) 
        this.setOffset(135, 90) 
        //Status booleans/utils
        this.direction = direction;
        this.isAttacking = false
        this.isRolling = false
        this.isDead = false
        this.iFrames = false
        this.isPaused = false
        this.swordHit = false
        this.doubleJump = 0
        this.currentAttack = null
        this.checkHit = false
        this.specialCounter = 3
        this.createUtils()
    }

    /**
     * Creates attack hitbox and status bar for player. 
     */
    createUtils() {
        this.attackBox = new Hitbox(this.scene, 200, 200, 150, 150)
        this.healthBar = new StatusBar(this.scene, 'player', 90, 60, 500, 30, 100, 100);
    }

    /**
     * Updates attackBox size/position depending on attack type. 
     * @param {string} attack is the current player attack. 
     * @param {string} direction is the current player dirwection. 
     */

    updateAttackBox(attack, direction) {
        let attackFrameOffset = { x: 0, y: 0 };
        let newAttackBoxX
        let newAttackBoxY
        let newScaleX = 1
        let newScaleY = 1

        switch (attack) {
            case 'attack':
                //regular attack box 
                this.currentAttack = 'attack'
                attackFrameOffset.x =
                    newScaleX = 1.12
                break
            case 'spattack':
                //special attack box 
                this.currentAttack = 'spattack'
                attackFrameOffset.x = 50
                newScaleX = 1.35
                break
        }

        //makes sure attackbox is always oriented ahead of player 
        if (direction === 'left') {
            newAttackBoxX = this.x - attackFrameOffset.x - 80;
            newAttackBoxY = this.y + attackFrameOffset.y + 90
        } else if (direction === 'right') {
            newAttackBoxX = this.x + attackFrameOffset.x + 80;
            newAttackBoxY = this.y + attackFrameOffset.y + 90
        }

        this.attackBox.setPosition(newAttackBoxX, newAttackBoxY);
        this.attackBox.setScale(newScaleX, newScaleY)
    }
    /**
     * Removes attackBox. 
     */
    removeAttackBox() {
        this.attackBox.destroy();
        this.attackBox = null;
    }

    /**
     * Decrease health based on attack received. 
     * @param {string} attack is the attack 
     */
    decreaseHealth(attack) {
        switch (attack) {
            case 'eattack1':
                this.healthBar.decreaseHealth(7.5)
                break
            case 'eattack2':
                this.healthBar.decreaseHealth(12.5)
                break
            case 'eattack3':
                this.healthBar.decreaseHealth(15)
                break
            case 'espattack':
                this.healthBar.decreaseHealth(20)
                break
            case 'eswords':
                this.healthBar.decreaseHealth(15)
                break
        }

        if (this.healthBar.healthValue <= 0) {
            this.isDead = true
        }
    }
}

/**
 * Idle State.
 */
export class IdleState extends State {

    constructor(enemy) {
        super();
        this.enemy = enemy;
    }

    /**
     * Idle enter state adds physics detection for enemy hitbox, plays idle animation, and resets velocity and double jump. 
     * 
     * @param {*} scene 
     * @param {*} player 
     * @param {*} enemy 
     */
    enter(scene, player, enemy) {
        player.scene.physics.add.overlap(player, enemy.attackBox, this.onAttackCollision, null, this)
        player.setVelocity(0)
        player.anims.play('idle', true);
        player.swords = true

        if (player.body.onFloor()) {
            player.doubleJump = 0
        }

    }

    /**
     * Execute state 
     * 
     * @param {scene} scene is the current scene 
     * @param {player} player is the player
     * @param {enemy} enemy is the enemy 
     */
    execute(scene, player, enemy) {

        const { left, right, up, space, down, CKey } = scene.keys;

        if (player.swordHit && !player.isRolling) {
            player.swordHit = false
            enemy.currentAttack = 'eswords'
            enemy.isAttacking = true
            this.stateMachine.transition('hurt')
            return
        }

        if (player.isDead) {
            this.stateMachine.transition('death')
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('attack');
            return;
        }

        if (player.specialCounter > 0 && Phaser.Input.Keyboard.JustDown(CKey)) {
            this.stateMachine.transition('spattack');
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(up)) {
            this.stateMachine.transition('jump')
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('roll');
            return;
        }

        if (left.isDown || right.isDown) {
            this.stateMachine.transition('move');
            return;
        }
    }

    onAttackCollision(player) {
        if ((this.enemy.isAttacking && !player.isRolling)) {
            this.stateMachine.transition('hurt')
        }
    }
}

/**
 * Move State. 
 */
export class MoveState extends State {

    enter(scene, player) {
        player.anims.play('run', true);
    }

    /**
     * Pretty much all the same functionality as idle execute, but controls run speed and animation orientation
     * based on left or right direction. 
     */
    execute(scene, player, enemy) {
        const { left, right, up, down, space, CKey, MKey } = scene.keys;

        if (player.isDead) {
            this.stateMachine.transition('death')
            return;
        }

        if (player.swordHit && !player.isRolling) {
            player.swordHit = false
            enemy.currentAttack = 'eswords'
            enemy.isAttacking = true
            this.stateMachine.transition('hurt')
            return
        }

        if (Phaser.Input.Keyboard.JustDown(up)) {
            this.stateMachine.transition('jump');
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('attack');
            return;
        }

        if (player.specialCounter > 0 && Phaser.Input.Keyboard.JustDown(CKey)) {
            this.stateMachine.transition('spattack');
            return;
        }

        if (Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('roll');
            return;
        }

        if (left.isDown) {
            player.flipX = true;
            player.setVelocityX(-RUN_SPEED);
            player.direction = 'left';
        } else if (right.isDown) {
            player.flipX = false;
            player.setVelocityX(RUN_SPEED);
            player.direction = 'right';
        } else {
            this.stateMachine.transition('idle');
        }
    }

    onAttackCollision(player, enemy) {

        if (enemy.isAttacking && !player.isRolling) {
            this.stateMachine.transition('hurt');
        }
    }
}

/**
 * Roll State. 
 */
export class RollState extends State {

    /**
     * Enter sets roll speed based on direction, and plays roll animation
     * 
     * @param {*} scene 
     * @param {*} player 
     */
    enter(scene, player) {
        const rollSpeed = player.direction === 'left' ? -DODGE_SPEED : DODGE_SPEED;
        player.setVelocityX(rollSpeed);
        player.isRolling = false
        player.anims.play('roll', false);
    }

    /**
     * Grants i-frames based on frame index of dodge. 
     * 
     * @param {*} scene 
     * @param {*} player 
     */
    execute(scene, player) {

        const currentFrameIndex = player.anims.currentFrame.index;

        if (currentFrameIndex >= 2 && currentFrameIndex <= 6) {
            player.isRolling = true
            return
        }

        player.once('animationcomplete', () => {
            player.isRolling = false
            this.stateMachine.transition('idle');
        });
    }
}

/**
 * Jump State. 
 */
export class JumpState extends State {

    /**
     * Enter state increments jump counter, plays jump animation, changes velocity. 
     * 
     * @param {*} scene 
     * @param {*} player 
     */
    enter(scene, player) {
        if (player.doubleJump < 3) {
            player.doubleJump++
            player.anims.play('jump')
            player.setVelocity(-JUMP_SPEED)
        }
    }

    /**
     * Execute state 
     * 
     * @param {*} scene 
     * @param {*} player 
     * @param {*} enemy 
     * @returns 
     */
    execute(scene, player, enemy) {
        const { left, right, up } = scene.keys

        if (Phaser.Input.Keyboard.JustDown(up)) {
            player.doubleJump++
            this.stateMachine.transition('jump');
        }

        if (player.swordHit && !player.isRolling) {
            player.swordHit = false
            enemy.currentAttack = 'eswords'
            enemy.isAttacking = true
            this.stateMachine.transition('hurt')
            return
        }

        if (left.isDown) {
            player.flipX = true
            player.setVelocityX(-RUN_SPEED);
            player.direction = 'left';
        } else if (right.isDown) {
            player.flipX = false
            player.setVelocityX(RUN_SPEED);
            player.direction = 'right';
        } else {
            player.setVelocityX(0)
        }

        if (player.body.velocity.y >= 0) {
            this.stateMachine.transition('fall');
        }
    }
}

/**
 * Fall State. 
 */
export class FallState extends State {

    enter(scene, player) {
        player.anims.play('fall', true);
    }

    execute(scene, player, enemy) {
        const { left, right, up } = scene.keys;

        if (Phaser.Input.Keyboard.JustDown(up)) {
            player.doubleJump++;
            this.stateMachine.transition('jump');
        }

        if (player.swordHit && !player.isRolling) {
            player.swordHit = false
            enemy.currentAttack = 'eswords'
            enemy.isAttacking = true
            this.stateMachine.transition('hurt')
            return
        }

        if (left.isDown) {
            player.flipX = true;
            player.direction = 'left';

        } else if (right.isDown) {
            player.flipX = false;
            player.direction = 'right';
        }

        if (player.body.onFloor()) {
            this.stateMachine.transition('idle');
        }
    }
}

/**
 * Attack State. 
 */
export class AttackState extends State {

    /**
     * Attack State enter updates current attack, updates attackBox, and plays attack animation. 
     * 
     * @param {*} player 
     */
    enter(scene, player) {
        player.currentAttack = 'attack';
        player.setVelocity(0);
        player.updateAttackBox(player.currentAttack, player.direction);
        player.anims.play('attack', false);
        //Initializes player.isAttacking to false intially because of frame update later in execute
        player.isAttacking = false
    }
    /**
     * Bases active attack frames off of animation frame index. 
     * 
     * @param {*} scene 
     * @param {*} player 
     * @param {*} enemy 
     */
    execute(scene, player, enemy) {

        const currentFrameIndex = player.anims.currentFrame.index;

        if (player.swordHit && !player.isRolling) {
            player.swordHit = false
            enemy.currentAttack = 'eswords'
            enemy.isAttacking = true
            this.stateMachine.transition('hurt')
            return
        }

        if (currentFrameIndex >= 4 && currentFrameIndex <= 6 && !player.checkHit) {
            player.checkHit = true
            player.isAttacking = true
            return
        }

        if (currentFrameIndex > 6) {
            player.isAttacking = false
        }

        player.once('animationcomplete', () => {
            player.isAttacking = false
            player.checkHit = false
            this.stateMachine.transition('idle');
        });

    }
}

/**
 * Special Attack State. 
 */
export class SPAttackState extends State {

    /**
     * Special Attack state decrements special Attack counter, updates current attack, 
     * updates attackBox, and plays attack animation. 
     * 
     * @param {*} scene 
     * @param {*} player 
     */
    enter(scene, player) {
        player.specialCounter--
        const direction = player.direction;
        player.currentAttack = 'spattack';
        player.setVelocity(0);
        player.updateAttackBox(player.currentAttack, direction);
        player.anims.play('spattack', false);
        player.isAttacking = false
    }

    execute(scene, player, enemy) {
        const currentFrameIndex = player.anims.currentFrame.index;

        if (player.swordHit && !player.isRolling) {
            player.swordHit = false
            enemy.currentAttack = 'eswords'
            enemy.isAttacking = true
            this.stateMachine.transition('hurt')
            return
        }

        if (currentFrameIndex >= 12 && currentFrameIndex <= 15 && !player.checkHit) {
            player.checkHit = true
            player.isAttacking = true
            return
        }

        if (currentFrameIndex > 15) {
            player.isAttacking = false
        }

        player.once('animationcomplete', () => {
            player.isAttacking = false
            player.checkHit = false
            this.stateMachine.transition('idle');
        });
    }
}

/**
 * Hurt State. 
 */
export class HurtState extends State {

    enter(scene, player, enemy) {
        player.anims.play('hurt');

        //On hit, slows player movement based on direction they were facing when hit. 
        if (enemy.direction === 'left') {
            player.setVelocityX(-RUN_SPEED / 5);
        } else {
            player.setVelocityX(RUN_SPEED / 5);
        }

        //Decrements health based on enemy attack recieved. 
        if (enemy.isAttacking) {
            player.decreaseHealth(enemy.currentAttack);
            enemy.isAttacking = false;
        }

        player.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });

    }
}

export class DeathState extends State {

    enter(scene, player) {
        player.setVelocity(0);
        player.anims.play('death');
    }

    execute(scene, player) {
        player.once('animationcomplete', () => {
            player.anims.stop();
        });
    }
}

