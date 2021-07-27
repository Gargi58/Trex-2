var PLAY = 1;
var END = 0;
var gameState = PLAY;
var highScore = [0] , Hs = 0;
var bg;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){

  bg = loadImage("bg4.jpg");
  bg2 = loadImage("bg5.jpg");

  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

}

function setup() {
  
  createCanvas(displayWidth,displayHeight);
  
  trex = createSprite(displayWidth/12,displayHeight/(20/7),20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth/3,displayHeight/2,550,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(displayWidth/2,displayHeight/5);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,displayHeight/4);
  restart.scale = 4;
  restart.addImage(restartImg);

  
  gameOver.scale = 0.8;
  restart.scale = 0.8;
  
  invisibleGround = createSprite(displayWidth/3,displayHeight/2,displayWidth,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  trex.setCollider("rectangle",0,0,50,70);
  
  score = 0;
}

function draw() 
{
  camera.position.x = displayWidth/2;
  camera.position.y = trex.y;
  background(bg2);
  //displaying score
  textSize(22);
  text( score, displayWidth/1.1,displayHeight/9);
  text("Press up arrow key to jump", displayWidth/3,50);
  if(gameState === PLAY)
  {
       trex.changeAnimation("running", trex_running);
    
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -(4 + score/600);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    
    if (ground.x < 100)
    {
      ground.x = ground.width/2;
    }
    //jump when the space key is pressed
     if(keyDown("up") && trex.y >= displayHeight/2.2 ) 
    {
      jumpSound.play();
      trex.velocityY = -12.5;
    }
    if(score%700<=200 )
    {
      background(bg);
      fill("white");
      textSize(22);
      text(score, displayWidth/1.1,displayHeight/9);
      text("Press up arrow key to jump", displayWidth/3,50);
    }
    //add gravity
    trex.velocityY = trex.velocityY + 1
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex))
    {
      dieSound.play(); 
      highScore.push(score);
        gameState = END;
      //trex.velocityY = -10;
    }
    for(var i = 1 ;i<highScore.length;i++)
   {
    
    if(highScore[i]>Hs)
      Hs = highScore[i]
   }
   text("HI "+ Hs, displayWidth/1.2,displayHeight/9);
    if(score > 0 && score%100 ===0)
      {
         checkPointSound.play(); 
      }
  }
   else if (gameState === END)
   {
    textSize(22);
    text("HI "+ Hs, displayWidth/1.2,displayHeight/9);

      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
       if (mousePressedOver(restart))
    {
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
  
  console.log("camera = "+camera.position.x)
}

function spawnObstacles(){
 if (frameCount % 55 === 0){
   var obstacle = createSprite(displayWidth/1.5,displayHeight/2.09,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   

   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 160 === 0) {
     cloud = createSprite(displayWidth,displayHeight/5,40,10);
    cloud.y = Math.round(random(displayHeight/5,displayHeight/7));
    cloud.addImage(cloudImage);
    cloud.scale = 1.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 520;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset()
{
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameState = PLAY;
  score = 0;
  restart.visible = false;
  gameOver.visible = false;
}
