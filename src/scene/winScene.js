import PreloadManager from '../manager/PreloadManager.js'

export default class winScene extends Phaser.Scene { 
    constructor() { 
        super('winScene')
        this.resetButton
        this.menuButton 
    }

    preload() { 
        this.preloadManager = new PreloadManager(this)
        this.preloadManager.preloadWinUtils()
    }

    create() { 
        this.createWinText()
        this.createThankText()
        this.createResetButton()
        this.createMenuButton()
    }

    createWinText() { 
        this.winText = this.add.image(720, 410,'youwin').setOrigin(0.5).setScale(3)
    }

    createThankText() { 
        this.thankText = this.add.image(720, 500, 'thankyou').setOrigin(0.5).setScale(1)
    }

    createResetButton() { 
        this.replayButton = this.add.image(720, 570, 'reset').setOrigin(0.5).setAlpha(1)
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
        this.backButton = this.add.image(720, 640, 'menu').setOrigin(0.5).setAlpha(1)
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