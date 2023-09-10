import gameScene from "./gameScene.js"
import PreloadManager from '../manager/PreloadManager.js'
import AnimationManager from '../manager/AnimationManager.js';



export default class menuScene extends Phaser.Scene {
    constructor() {
        super('menuScene')
        this.titleBackground
        this.titlePlayButton
        this.titleCreditsButton
        this.titleSFXButton
    }

    preload() {
        this.preloadManager = new PreloadManager(this)
        this.preloadManager.preloadMenuUtils()
    }

    create() {
        this.animationManager = new AnimationManager(this);
        this.animationManager.createBackgroundAnims()
        this.createTitleBackground()      
        this.createTitleText()
        this.createPlayButton()
        this.createSFXButtons()
    }

    createTitleBackground() {
        this.titleBackground = this.add.sprite(0, 0, 'background1').setOrigin(0).setDepth(0)
        this.titleBackground.setScale(2.6, 3)
        this.titleBackground.setAlpha(0.7)

        this.titleBackground.play('banim', true)
    }

    createTitleText() {
        this.titleText = this.add.image(720, 390, 'title').setOrigin(0.5).setScale(2)
    }

    createPlayButton() {
        this.titlePlayButton = this.add.image(720, 490, 'play').setOrigin(0.5).setScale(1.25).setAlpha(1)
        this.titlePlayButton.setInteractive()

        this.titlePlayButton.on('pointerover', () => {
            this.titlePlayButton.setAlpha(0.75)
        })

        this.titlePlayButton.on('pointerout', () => {
            this.titlePlayButton.setAlpha(1)
        })

        this.titlePlayButton.on('pointerup', () => {
            this.scene.launch('gameScene')
            this.scene.sleep()
        })
    }

    createSFXButtons() {
        this.sound.pauseOnBlur = false;
        this.titleSFXButton = this.add.image(720, 580, 'musicbutton').setOrigin(0.5).setAlpha(1).setScale(1.25)
        this.titleSFXButton.setInteractive()
        let isMuted = false
        let music = this.sound.add('music')
        music.setVolume(0.1)
        music.play()


        this.titleSFXButton.on('pointerdown', () => {
            if (!isMuted) {
                this.titleSFXButton.setAlpha(0.5)
                music.setMute(true)
                isMuted = true
            } else {
                this.titleSFXButton.setAlpha(1)
                music.setMute(false)
                isMuted = false
            }
        })
    }






}