/** 
 * Preloads animation and audio from files. 
 */
export default class PreloadManager  { 
    constructor(scene) { 
		this.scene = scene
    }
	

	preloadMenuUtils() { 
		this.scene.load.setPath('./assets/utils')
		this.scene.load.image('play', 'play.png')
        this.scene.load.image('title', 'title.png')
        this.scene.load.image('musicbutton', 'music.png')
        this.scene.load.atlas('background1', 'background1.png', 'background1.json');
        this.scene.load.audio('music', [
            'gloomynightvoron.mp3',
            'whiskedawaykalaido.mp3',
            'Homework.ogg',
            'Evening Mood.ogg',
            'Morning Walk.ogg',
        ]);
	}

	preloadGameUtils() { 
		this.scene.load.setPath('./assets/utils/')
		this.scene.load.image('platform', 'platform.png', { frameWidth: 920, frameHeight: 614 });
		this.scene.load.image('clash', 'clash.png')
		this.scene.load.image('heart', 'heart.png')
		this.scene.load.image('purpleheart', 'purpleheart.png')
		this.scene.load.atlas('background1', 'background1.png', 'background1.json');
	}
	
    preloadPlayer() { 
		this.scene.load.setPath('./assets/player/')
		this.scene.load.atlas('playerspritesheet', 'playerspritesheet.png', 'playerspritesheet.json')
    }

    preloadEnemy() { 
		this.scene.load.setPath('./assets/enemy/')
		this.scene.load.image('sword', 'swordsmall.png', { frameWidth: 296, frameHeight: 296});
        this.scene.load.spritesheet('idle', 'idle.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('run', 'run.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('roll', 'roll.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('jump', 'jump.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('fall', 'fall.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('attack1', 'attack1.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('attack2', 'attack2.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('attack3', 'attack3.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('spattack', 'spattack.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('defend', 'defend.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('hurt', 'hurt.png', { frameWidth: 288, frameHeight: 128 });
		this.scene.load.spritesheet('death', 'death.png', { frameWidth: 288, frameHeight: 128 });    
	}

	preloadPauseUtils() { 
		this.scene.load.setPath('./assets/utils/')
		this.scene.load.image('pause', 'paused.png')
		this.scene.load.image('reset', 'reset.png')
		this.scene.load.image('menu', 'menu.png')
	}

	preloadWinUtils() { 
		this.scene.load.setPath('./assets/utils/')
		this.scene.load.image('youwin', 'youwin.png')
		this.scene.load.image('thankyou', 'thankyou.png')
		this.scene.load.image('reset', 'reset.png')
		this.scene.load.image('menu', 'menu.png')
	}

	preloadDeathUtils() { 
		this.scene.load.setPath('./assets/utils/')
		this.scene.load.image('youdied', 'youdied.png')
		this.scene.load.image('reset', 'reset.png')
		this.scene.load.image('menu', 'menu.png')
	}
}