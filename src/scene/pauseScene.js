import gameScene from "./gameScene.js"
import PreloadManager from '../manager/PreloadManager.js'

export default class pauseScene extends Phaser.Scene { 
    constructor() { 
        super('pauseScene')
        this.paused
        this.keys
    }

    preload() { 
        this.preloadManager = new PreloadManager(this)
        this.preloadManager.preloadPauseUtils()
    }

    create() { 
        this.createPausedText()
        this.createKeys()
        this.createMenuButton()
        this.createResetButton()

        this.keys.EscapeKey.on('down', () => {
			this.scene.resume('gameScene')
			this.scene.sleep()
		});
    }

    createPausedText() { 
        this.paused = this.add.image(720, 410,'pause').setOrigin(0.5).setScale(3)
    }

    createKeys() { 
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.EscapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    createResetButton() { 
        this.replayButton = this.add.image(720, 515, 'reset').setOrigin(0.5).setAlpha(1)
        this.replayButton.setInteractive()

        this.replayButton.on('pointerover', () => { 
            this.replayButton.setAlpha(0.75)
        })

        this.replayButton.on('pointerout', () => {
            this.replayButton.setAlpha(1)
        })

        this.replayButton.on('pointerup', () => {
            this.scene.stop()
            this.scene.launch('gameScene')
            
        })
    }

    createMenuButton() { 
        this.backButton = this.add.image(720, 590, 'menu').setOrigin(0.5).setAlpha(1)
        this.backButton.setInteractive()

        this.backButton.on('pointerover', () => { 
            this.backButton.setAlpha(0.75)
        })

        this.backButton.on('pointerout', () => { 
            this.backButton.setAlpha(1)
        })

        this.backButton.on('pointerup', () => {
            this.scene.stop('pauseScene')
            this.scene.stop('gameScene')
            this.scene.wake('menuScene')
        })
    }

    
    
}