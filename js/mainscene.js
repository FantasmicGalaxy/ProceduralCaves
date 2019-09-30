import MapGenerator from './mapgenerator.js'
import Player from './player.js';
import Enemy from './enemy.js'

let map, player;

let enemy;

export default class MainScene extends Phaser.Scene {
    constructor() {
        super( {key: 'MainScene'});
    }

    preload() {
        this.load.image('tile', 'res/tile.png');
        this.load.image('tilebottom', 'res/tilebottom.png');
        this.load.image('wrench', 'res/wrench.png');
        this.load.image('player', 'res/player.png');
        this.load.image('enemy', 'res/enemy.png');
    }

    create() {
        let seed = new Date();
        seed = seed.getTime().toString()
        map = new MapGenerator(this, 32, 32, seed, 45, 16, 'tile', 'tilebottom', 2);
        console.log(seed);

        player = new Player(this, 400, 300, 'player', 'wrench', map);

        enemy = new Enemy(this, 0, 0, 'enemy', player, map);

        this.physics.add.collider(player.sprite, map.tiles, function (tiles) {});
        this.physics.add.collider(player.wrenches, map.tiles, function (wrench, tiles) {
            wrench.destroy();
        });
        this.physics.add.collider(enemy.sprite, map.tiles);
    }

    update() {
        player.update();
        enemy.update();
        this.cameras.main.startFollow(player.sprite, true, 0.01, 0.01);
    }
}