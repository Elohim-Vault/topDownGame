import Enemy from "./enemy";

class Enemies extends Phaser.Physics.Arcade.Group{

    constructor(world, scene, children, spriteArray){
        super(world, scene, children, {});
        this.scene = scene

        this.createEnemies(scene, spriteArray);
    }
    
    // Criando nossos inimigos com um foreach para se aleatorizar de acordo com o nosso JSON
    createEnemies(scene, spriteArray){
        spriteArray.forEach(sprite => {
            // Criando um único inimigo
            const enemy = new Enemy(scene, sprite.x, sprite.y);

            // Adicionando ao grupo de sprites (inimigos)
            this.add(enemy);

            // Destruindo o sprite
            sprite.destroy();
        })
    }
}

export default Enemies