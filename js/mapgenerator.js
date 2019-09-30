export default class MapGenerator {
    constructor(scene, width, height, seed, fillPercent, tileSize, tileSprite, tilebottomSprite, smootheness) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.seed = seed;
        this.fillPercent = fillPercent;
        this.tileSize = tileSize;
        this.tileSprite = tileSprite;
        this.tilebottomSprite = tilebottomSprite;
        this.smootheness = smootheness;

        this.map = this.makeArray(this.width, this.height);
        this.prevMap = this.map;
        this.tiles = this.scene.physics.add.staticGroup();
        
        this.generateMap(this.seed);
    }

    generateMap(seed) {
        this.fillMap(seed);
        
        for (let i = 0; i < this.smootheness; i++) {
            this.smoothMap();
            this.prevMap = this.map;
        }

        this.renderMap();
    }

    fillMap(seed) {
        Math.seedrandom(seed);
        let rand;

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    this.map[x][y] = 1;
                } else {
                    rand = Math.floor(Math.random() * 100);
                    this.map[x][y] = (rand < this.fillPercent) ? 1: 0;
                }
            }
        }
    }

    smoothMap() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let nearbyWallTiles = this.getNearbyWallCount(x, y);

                if (nearbyWallTiles > 4)
                    this.map[x][y] = 1;
                else if (nearbyWallTiles < 4)
                    this.map[x][y] = 0;
            }
        }
    }

    getNearbyWallCount(gridX, gridY) {
        let wallCount = 0;
        for (let checkX = gridX - 1; checkX <= gridX + 1; checkX++) {
            for (let checkY = gridY - 1; checkY <= gridY + 1; checkY++) {
                if (checkX >= 0 && checkX < this.width && checkY >= 0 && checkY < this.height) {
                    if (checkX != gridX || checkY != gridY) {
                        wallCount += this.prevMap[checkX][checkY];
                    }
                } else {
                    wallCount++;
                }
            }
        }
        return wallCount;
    }

    getTileFromWorldPoint(worldX, worldY) {
        let gridX = Math.round((worldX - 400) / this.tileSize) + Math.floor(this.width / 2);
        let gridY = Math.round((worldY - 300) / this.tileSize) + Math.floor(this.height / 2);
        return {
            x: gridX,
            y: gridY
        };
    }

    renderMap() {
        this.tiles.clear(true, true);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.map[x][y] === 1) {
                    if (this.map[x][y + 1] === 0 || y === this.height - 1) {
                        this.tiles.create(x * this.tileSize - (this.tileSize * this.width) / 2 + 400, y * this.tileSize - (this.tileSize * this.height) / 2 + 300, this.tilebottomSprite).setSize(16, 16, true);
                    } else {
                        this.tiles.create(x * this.tileSize - (this.tileSize * this.width) / 2 + 400, y * this.tileSize - (this.tileSize * this.height) / 2 + 300, this.tileSprite).setSize(16, 16, true);
                    }
                }
            }
        }
    }

    makeArray(d1, d2) {
        var arr = [];
        for(let i = 0; i < d2; i++) {
            arr.push(new Array(d1));
        }
        return arr;
    }
}