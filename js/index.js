import MainScene from './mainscene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'body',
    width: 800,
    height: 600,
    backgroundColor: 0xFFFFFF,
    physics: {
        default: "arcade",
        arcade: {
            fps: 60,
            gravity: { y: 0 },
            // debug: true
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);