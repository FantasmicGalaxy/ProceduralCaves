export default class Enemy {
    constructor(scene, x, y, sprite, target, map) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = target;
        this.map = map;

        this.mineRate = 1500;
        this.timeUntilMine = 0;

        this.sprite = this.scene.physics.add.image(this.x, this.y, sprite).setScale(0.9);
    }

    update() {
        this.scene.physics.moveTo(this.sprite, this.target.sprite.x, this.target.sprite.y, 100);

        if (this.scene.time.now > this.timeUntilMine) {
            this.mineNearbyTiles();
        }
    }

    mineNearbyTiles() {
        let tilePos = this.map.getTileFromWorldPoint(this.sprite.x, this.sprite.y);
        console.log(tilePos);

        for (let checkX = tilePos.x - 1; checkX <= tilePos.x + 1; checkX++) {
            for (let checkY = tilePos.y - 1; checkY <= tilePos.y + 1; checkY++) {
                if (checkX >= 0 && checkX < this.map.width && checkY >= 0 && checkY < this.map.height) {
                    if (this.map.map[checkX][checkY] === 1) {
                        this.map.map[checkX][checkY] = 0;
                    }
                }
            }
        }
        this.map.renderMap();
        this.timeUntilMine = this.scene.time.now + this.mineRate;
    }
}