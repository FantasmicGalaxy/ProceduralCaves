export default class Player {
    constructor(scene, x, y, sprite, wrench, map) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.map = map;

        this.keys = {};
        this.keys.E = this.scene.input.keyboard.addKey('E');
        this.keys.W = this.scene.input.keyboard.addKey('W');
        this.keys.S = this.scene.input.keyboard.addKey('S');
        this.keys.D = this.scene.input.keyboard.addKey('D');
        this.keys.A = this.scene.input.keyboard.addKey('A');
        this.keys.cursors = this.scene.input.keyboard.createCursorKeys();

        this.sprite = this.scene.physics.add.image(this.x, this.y, sprite).setScale(0.9);
        this.sprite.depth = 10;
        this.wrench = this.scene.add.image(this.x, this.y, wrench).setScale(0.95).setOrigin(0);
        this.playerSprite = sprite;
        this.wrench.depth = 10;
        this.speed = 150;
        this.reach = 16;
        this.mineRate = 500;
        this.timeUntilMine = 0;
        this.mining = false;
        this.shootRate = 350;
        this.timeUntilShoot = 0;
        this.sprite.body.setMaxSpeed(this.speed);

        this.wrenches = this.scene.physics.add.group();
    }

    update() {
        if (this.keys.D.isDown) {
            this.sprite.setVelocityX(this.speed);
        } else if (this.keys.A.isDown) {
            this.sprite.setVelocityX(-this.speed);
        } else {
            this.sprite.setVelocityX(0);
        }

        if (this.keys.W.isDown) {
            this.sprite.setVelocityY(-this.speed);
        } else if (this.keys.S.isDown) {
            this.sprite.setVelocityY(this.speed);
        } else {
            this.sprite.setVelocityY(0);
        }
        this.wrench.x = this.sprite.x;
        this.wrench.y = this.sprite.y;

        this.scene.input.on('pointermove', (pointer) => {
            let cursor = pointer;
            let angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, cursor.x + this.scene.cameras.main.scrollX, cursor.y + this.scene.cameras.main.scrollY);
            this.wrench.rotation = angle - Math.PI/4;
        }, this);

        let pointer = this.scene.input.activePointer;

        if (this.scene.input.activePointer.isDown) {
            if (this.scene.time.now > this.timeUntilMine && this.mining) {
                this.mineTile(pointer);
            } else if (this.scene.time.now > this.timeUntilShoot && !this.mining) {
                this.throwWrenches(pointer);
            }
        }

        let pressed = Phaser.Input.Keyboard.JustDown(this.keys.E);
        if (pressed)
            this.mining = !this.mining;

        if (this.mining) {
            this.wrench.alpha = 1;
        } else {
            this.wrench.alpha = 0;
        }
    }

    mineTile(pointer) {
        let pointerVector = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
        let playerVector = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
        pointerVector = pointerVector.subtract(playerVector);
        pointerVector = pointerVector.normalize();
        pointerVector.scale(this.reach);
        let tile = this.map.getTileFromWorldPoint(pointerVector.x + playerVector.x, pointerVector.y + playerVector.y);
        if (tile.x >= 0 && tile.x < this.map.width && tile.y >= 0 && tile.y < this.map.height) {
            if (this.map.map[tile.x][tile.y] === 1) {
                this.map.map[tile.x][tile.y] = 0;
                this.map.renderMap();
                this.timeUntilMine = this.scene.time.now + this.mineRate;
            }
        }
    }

    throwWrenches(pointer) {
        let pointerVector = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);
        let playerVector = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
        pointerVector = pointerVector.subtract(playerVector);
        pointerVector = pointerVector.normalize();
        pointerVector.scale(this.reach);
        let currentWrench = this.wrenches.create(playerVector.x + pointerVector.x, playerVector.y + pointerVector.y, this.playerSprite).setScale(0.25);
        this.scene.physics.moveTo(currentWrench, pointer.worldX, pointer.worldY, 300);
        currentWrench.setAngularVelocity(-360 + Math.round(Math.random() * 720));
        this.timeUntilShoot = this.scene.time.now + this.shootRate;
    }
}