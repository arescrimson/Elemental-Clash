import menuScene from "./scene/menuScene.js"
import gameScene from "./scene/gameScene.js"
import pauseScene from "./scene/pauseScene.js"
import winScene from "./scene/winScene.js"
import deathScene from "./scene/deathScene.js"

const FRAME_WIDTH = 1440
const FRAME_HEIGHT = 810
const GRAVITY = 1200

const config = {
  type: Phaser.AUTO,
  width: FRAME_WIDTH,
  height: FRAME_HEIGHT,
  scene: [menuScene, gameScene, pauseScene, winScene, deathScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GRAVITY },
      debug: false
    }
  },
};

const game = new Phaser.Game(config);

