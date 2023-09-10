import pauseScene from "./pauseScene.js"
import { StateMachine } from '../lib/StateMachine.js';
import { Player, IdleState, MoveState, RollState, JumpState, FallState, AttackState, SPAttackState, HurtState, DeathState } from '../player/Player.js'
import { Enemy, EMainState, EMoveState, ERollState, EJumpState, EFallState, EAttack1State, EAttack2State, EAttack3State, ESPAttackState, EDefendState, EHurtState, EDeathState } from '../enemy/Enemy.js'
import AnimationManager from '../manager/AnimationManager.js';
import PreloadManager from '../manager/PreloadManager.js'

export default class gameScene extends Phaser.Scene {

	constructor() {
		super('gameScene')
		this.isPaused = false
	}


	preload() {
		this.preloadManager = new PreloadManager(this)
		this.preloadManager.preloadGameUtils()
		this.preloadManager.preloadPlayer()
		this.preloadManager.preloadEnemy()
	}

	create() {
		this.animationManager = new AnimationManager(this);
		this.animationManager.createPlayerAnims();
		this.animationManager.createEnemyAnims();

		this.createBackground()
		this.createGround()
		this.createPlayers()
		this.createIcon()
		this.createStateMachines()
		this.createKeys()

		this.keys.EscapeKey.on('down', () => {
			this.scene.launch('pauseScene')
			this.scene.pause()
		});
	}

	createBackground() {
		this.background = this.add.sprite(0, 0, 'background1').setOrigin(0)
		this.background.setScale(2.6, 3)
		this.background.setAlpha(0.7)

		this.background.anims.create({
			key: 'banim',
			frames: this.anims.generateFrameNames('background1', { prefix: 'b', start: 1, end: 8 }),
			frameRate: 8,
			repeat: -1
		});

		this.background.play('banim', true)
	}


	createGround() {
		this.ground = this.physics.add.staticSprite(725, 770, "platform")
		this.ground.setSize(1440, 5, true)
		this.ground.setScale(0.5)
		this.ground.setImmovable(true)
		this.ground.alpha = 0
	}

	createPlayers() {
		this.player = new Player(this, 300, 300, 'idleR', 0, 'right');
		this.add.image(65, 75, 'heart').setScale(0.3)
		this.enemy = new Enemy(this, 1100, 300, 'eidle', 0, 'left', this.player, this.ground);
		this.add.image(1370, 75, 'purpleheart').setScale(0.3)
		this.physics.add.collider(this.player, this.ground);
		this.physics.add.collider(this.enemy, this.ground);
	}

	createIcon() { 
		//this.add.rectangle(720, 75, 250, 100, 0xADD8E6).setOrigin(0.5).setAlpha(0.25)
		//this.add.image(720, 75, 'clash').setOrigin(0.5).setAlpha(1).setScale(1.5)
	}

	createStateMachines() {
		this.playerStateMachine = new StateMachine('idle', {
			idle: new IdleState(this.enemy),
			move: new MoveState(),
			roll: new RollState(),
			jump: new JumpState(),
			fall: new FallState(),
			attack: new AttackState(),
			spattack: new SPAttackState(),
			hurt: new HurtState(),
			death: new DeathState()
		}, [this, this.player, this.enemy]);

		this.enemyStateMachine = new StateMachine('emain', {
			emain: new EMainState(this.player),
			emove: new EMoveState(this.player),
			ejump: new EJumpState(),
			eroll: new ERollState(),
			efall: new EFallState(),
			eattack1: new EAttack1State(),
			eattack2: new EAttack2State(),
			eattack3: new EAttack3State(),
			espattack: new ESPAttackState(),
			edefend: new EDefendState(),
			ehurt: new EHurtState(),
			edeath: new EDeathState(),
		}, [this, this.enemy, this.player]);
	}

	createKeys() {
		this.keys = this.input.keyboard.createCursorKeys()
		this.keys.MKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
		this.keys.CKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
		this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
		this.keys.GKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G)
		this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
		this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
		this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
		this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
		this.keys.EKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
		this.keys.EscapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

	}

	togglePause() {
		if (this.isPaused) {
			this.isPaused = false
		} else {
			this.isPaused = true
		}
	}


	update() {
		this.playerStateMachine.step();
		this.enemyStateMachine.step();

		if (this.player.isDead) {
			this.time.delayedCall(2000, () => {
				this.scene.stop()
				this.scene.launch('deathScene')
				return
			})
		}

		if (this.enemy.isDead) {
			this.time.delayedCall(2000, () => {
				this.scene.stop()
				this.scene.launch('winScene')
				return
			})
		}
	}
}




