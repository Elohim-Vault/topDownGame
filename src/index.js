import Phaser from "phaser";
import mapPNG from "./assets/assetsmap.png";
import mapJSON from "./assets/map.json";
import water from "./assets/water.png";
import playerPNG from "./assets/player5.png";
import EnemyPNG from "./assets/slime.png"
import Enemies from "./Enemies";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 650,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config);
let player;
var cursors;
var enemies;
function preload() {
  this.load.image("tiles", mapPNG);
  this.load.tilemapTiledJSON("map", mapJSON);

  this.load.image("background", water);
  this.load.spritesheet("player", playerPNG, {frameWidth: 32, frameHeight: 60});
  this.load.image("slime", EnemyPNG)
}

function create() {
  const map = this.make.tilemap({ "key" : "map"});
  const tileset = map.addTilesetImage("assets", "tiles");
  this.add.image(650, 650, "background");

  const ground = map.createStaticLayer("ground", tileset, 0, 0)
  const objectCollider = map.createStaticLayer("objectCollider", tileset, 0, 0)
  const aboveObject = map.createStaticLayer("aboveObject", tileset, 0, 0);
  objectCollider.setCollisionByProperty({collider: true});
  aboveObject.setDepth(10); 

  
  // Player
  const spawnPoint = map.findObject(
    'player',
    objects => objects.name === "spawning point"
    );
    player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
    
    this.physics.add.collider(player, objectCollider);
    
    
    
    // Creating my enemies
    this.enemies = map.createFromObjects("enemy", "enemy", {});
    this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies)
   this.physics.add.collider(player, this.enemiesGroup, hitEnemy, null, this);
    //enemy collider object
    this.physics.add.collider(objectCollider, this.enemiesGroup);
    //animations


    cursors = this.input.keyboard.createCursorKeys();
  
  
  const anims = this.anims;
  anims.create({
    key: "left",
    frames: anims.generateFrameNames("player", { start: 20, end: 21 }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNames("player", { start: 20, end: 21 }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "front",
    frames: anims.generateFrameNames("player", { start: 0, end: 9 }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "back",
    frames: anims.generateFrameNames("player", { start: 11, end: 19 }),
    frameRate: 10,
    repeat: -1,
  });

  // Camera

  const camera = this.cameras.main
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}

function update(){
  const prevVelocity = player.body.velocity.clone();

  player.body.setVelocity(0);
  
  if(cursors.left.isDown){
    player.body.setVelocityX(-200);
    player.anims.play("left", true);
  }
  
  else if(cursors.right.isDown){
    player.body.setVelocityX(200);
    player.anims.play("right", true);
  }
  
  else if(cursors.up.isDown){
    player.body.setVelocityY(-200);
    player.anims.play("back", true);
  }
  
  else if(cursors.down.isDown){
    player.body.setVelocityY(200);
    player.anims.play("front", true);
  }else{
    player.anims.stop();

    if(prevVelocity.x < 0) player.setTexture("player", "left");
    else if(prevVelocity.x > 0) player.setTexture("player", "right");
    else if(prevVelocity.y < 0) player.setTexture("player", "back");
    else if(prevVelocity.y > 0) player.setTexture("player", "front");
  }
}

function hitEnemy(player, enemyGroup) {
  this.scene.restart();
}
