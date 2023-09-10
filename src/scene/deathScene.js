import PreloadManager from '../manager/PreloadManager.js'

export default class deathScene extends Phaser.Scene { 
    constructor() { 
        super('deathScene')
        this.resetButton
        this.menuButton 
    }

    preload() { 
        this.preloadManager = new PreloadManager(this)
        this.preloadManager.preloadDeathUtils()
    }

    create() { 
        this.createDeathText()
        this.createResetButton()
        this.createMenuButton()
    }

    createDeathText() { 
        this.deathText = this.add.image(720, 410,'youdied').setOrigin(0.5).setScale(3)
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
            this.scene.stop()
            this.scene.wake('menuScene')
        })
    }
}