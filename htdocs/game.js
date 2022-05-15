
 

var game;
var gameOptions = 
{
    bounceHeight: 300,
    Gravity: 1200,
    ballPosition: 0.2,
    PlatformS: 650,
    PlatDistanceR: [250, 450],
    PlatformHRange: [-50, 50],
    PlatformLRange: [40, 60],
    localStorageName: "bestballscore3"
    
}
window.onload = function() 
{
    let gameConfig = {
        type: Phaser.AUTO,
     //  backgroundColor:0x000080,//0x4c2882
     /*scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 750,
            height: 500

        },*/
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 900,
        height: 730,
        physics: {
            default: "arcade"
        },
        audio: {
            disableWebAudio: true
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class playGame extends Phaser.Scene{
    constructor()
    {
        super("PlayGame");
    }
    
    
    preload()
    {
        this.load.audio('theme', 'fondoGameWeb.mp3' );

        this.load.image("ground", "ground.png");
        this.load.image("ball", "orb-red.png");
        this.load.image('Fondo', 'fondo3.jpg');


    }
    
    
    create()
    {

    
        this.add.image(500, 400, 'Fondo');

       
        var music = this.sound.add('theme');
        music.play();

        music.loop=true;
        
       

        this.platformGroup = this.physics.add.group();
        this.ball = this.physics.add.sprite(game.config.width * gameOptions.ballPosition, game.config.height / 4 * 3 - gameOptions.bounceHeight, "ball");
        this.ball.body.gravity.y = gameOptions.Gravity;
        this.ball.setBounce(1);
        this.ball.body.checkCollision.down = true;
        this.ball.body.checkCollision.up = false;
        this.ball.body.checkCollision.left = false;
        this.ball.body.checkCollision.right = false;
        this.ball.setSize(22, 22, true)

        let platformX = this.ball.x;
        for(let i = 0; i < 10; i++)
        {
            let platform = this.platformGroup.create(platformX, game.config.height / 4 * 3 + Phaser.Math.Between(gameOptions.PlatformHRange[0], gameOptions.PlatformHRange[1]), "ground");
            platform.setOrigin(0.5, 1);
            platform.setImmovable(true);
            platform.displayWidth = Phaser.Math.Between(gameOptions.PlatformLRange[0], gameOptions.PlatformLRange[1]);
            platformX += Phaser.Math.Between(gameOptions.PlatDistanceR[0], gameOptions.PlatDistanceR[1]);
        }
        this.input.on("pointerdown", this.movePlatforms, this);
        this.input.on("pointerup", this.stopPlatforms, this);
        this.score = 0;
        this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
        this.scoreText = this.add.text(20, 10, "");
        this.updateScore(this.score);


    }
    
    
    updateScore(inc)
    {
        this.score += inc;
        this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
    }
    
    
    movePlatforms()
    {
        this.platformGroup.setVelocityX(-gameOptions.PlatformS);
    }
    
    
    stopPlatforms()
    {
        this.platformGroup.setVelocityX(0);
    }
    
    
    getRightmostPlatform()
    {
        let rightmostPlatform = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            rightmostPlatform = Math.max(rightmostPlatform, platform.x);
        });
        return rightmostPlatform;
    }
    
    
    update()
    {
        this.physics.world.collide(this.platformGroup, this.ball);
        this.platformGroup.getChildren().forEach(function(platform){
            if(platform.getBounds().right < 0)
            {
                this.updateScore(1);
                platform.x = this.getRightmostPlatform() + Phaser.Math.Between(gameOptions.PlatDistanceR[0], gameOptions.PlatDistanceR[1]);
                platform.displayWidth = Phaser.Math.Between(gameOptions.PlatformLRange[0], gameOptions.PlatformLRange[1]);
            }
        }, this);
        if(this.ball.y > game.config.height)
        {
            localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
            this.scene.start("PlayGame");
            

        }
    }
}

