const VIEW_W = 1000, VIEW_H = 1000;

class SceneMain extends Phaser.Scene {
    constructor() {
        super();
        this.camSpeed = 400;
        this.cameraJump = 200;
        this.snapToGrid = true;
        this.gridSize = 200;
    }

    preload() {
        console.log('preload started');
        this.load.image('tileset', 'assets/tiles/tileset.png');
        
        
        const timestamp = new Date().getTime();
        this.load.tilemapTiledJSON('mymap', `assets/maps/mymap.json?nocache=${timestamp}`);
    }

    create() {
        console.log('create started');
        
        const map = this.make.tilemap({ key: 'mymap' });
        if (!map) {
            console.error('Map not loaded');
            return;
        }
        
        console.log(`Mapa cargado: ${map.width} x ${map.height} tiles`);
        console.log(`Tamaño tile: ${map.tileWidth} x ${map.tileHeight} px`);
        
        if (map.width === 42 && map.height === 60) {
            console.log('✅ MAPA CORRECTO (42x60)');
        } else {
            console.warn(`⚠️ Dimensiones inesperadas: ${map.width}x${map.height}`);
        }
        
        const tileset = map.addTilesetImage('tileset', 'tileset', map.tileWidth, map.tileHeight);
        const layer = map.createLayer(map.layers[0].name, tileset);
        
        const worldWidth = map.width * map.tileWidth;
        const worldHeight = map.height * map.tileHeight;
        
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        
        const startTileX = 19;
        const startTileY = 29;
        
        let startPixelX = (startTileX * map.tileWidth) + (map.tileWidth / 2) - (VIEW_W / 2);
        let startPixelY = (startTileY * map.tileHeight) + (map.tileHeight / 2) - (VIEW_H / 2);
        
        startPixelX = Phaser.Math.Clamp(startPixelX, 0, worldWidth - VIEW_W);
        startPixelY = Phaser.Math.Clamp(startPixelY, 0, worldHeight - VIEW_H);
        
        if (this.snapToGrid) {
            startPixelX = Math.round(startPixelX / this.gridSize) * this.gridSize;
            startPixelY = Math.round(startPixelY / this.gridSize) * this.gridSize;
        }
        
        this.cameras.main.scrollX = startPixelX;
        this.cameras.main.scrollY = startPixelY;
        
        console.log(`Cámara iniciada en tile (${startTileX}, ${startTileY})`);
        console.log(`Posición cámara: (${this.cameras.main.scrollX}, ${this.cameras.main.scrollY})`);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        
        this.lastMoveTime = 0;
        this.moveDelay = 120;
        
        console.log('Setup complete!');
    }

    update(time, dt) {
        const cam = this.cameras.main;
        let moveX = 0, moveY = 0;
        
        if (this.cursors.left.isDown || this.wasd.left.isDown) moveX = -1;
        if (this.cursors.right.isDown || this.wasd.right.isDown) moveX = 1;
        if (this.cursors.up.isDown || this.wasd.up.isDown) moveY = -1;
        if (this.cursors.down.isDown || this.wasd.down.isDown) moveY = 1;
        
        if ((moveX !== 0 || moveY !== 0) && (time - this.lastMoveTime >= this.moveDelay)) {
            this.lastMoveTime = time;
            
            let newX = cam.scrollX + moveX * this.cameraJump;
            let newY = cam.scrollY + moveY * this.cameraJump;
            
            newX = Math.round(newX / this.gridSize) * this.gridSize;
            newY = Math.round(newY / this.gridSize) * this.gridSize;
            
            const bounds = cam.getBounds();
            if (bounds) {
                newX = Phaser.Math.Clamp(newX, bounds.x, bounds.right - cam.width);
                newY = Phaser.Math.Clamp(newY, bounds.y, bounds.bottom - cam.height);
            }
            
            cam.scrollX = newX;
            cam.scrollY = newY;
        }
    }
}


const config = {
    type: Phaser.CANVAS,  
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#000000',
    scene: SceneMain
};

window.addEventListener('load', () => {
    new Phaser.Game(config);
});
