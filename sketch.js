var trex,trex_running,trex_collided;
var ground,ground_img,invisible_ground;
var cloud,cloud_img,cloud_group;
var obstacles,obstacle_1,obstacle_2,obstacle_3,obstacle_4,obstacle_5,
obstacle_6,obstacle_group;

var score;

var PLAY = 1;
var END = 0;
var gameState = 1;

var dead_sound;
var checkPoint_sound;
var jump_sound;

var gameOver, game_over;
var restart,restart_img

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  ground_img = loadImage("ground2.png");
  cloud_img = loadImage("cloud.png");
  
  obstacle_1 = loadImage("obstacle1.png");
  obstacle_2 = loadImage("obstacle2.png");
  obstacle_3 = loadImage("obstacle3.png");
  obstacle_4 = loadImage("obstacle4.png");
  obstacle_5 = loadImage("obstacle5.png");
  obstacle_6 = loadImage("obstacle6.png");
  dead_sound = loadSound("die.mp3");
  checkPoint_sound = loadSound("checkPoint.mp3");
  jump_sound = loadSound("jump.mp3");
  
  trex_collided = loadAnimation("trex_collided.png");
  
  game_over = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  trex=createSprite(50,150,10,10);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("dead",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(300,180,600,20);
  ground.addImage(ground_img);
  
  ground.x = ground.width/2;
  invisible_ground = createSprite(300,190,600,5);
  invisible_ground.visible = false;
  
  score = 0;
  
  cloud_group = new Group(); 
  obstacle_group = new Group();
  
  //trex.debug = true;
  trex.setCollider("circle",0,0,40);
  
  gameOver = createSprite(300,100,10,10);
  restart = createSprite(300,140,10,10);
  gameOver.addImage(game_over);
  restart.addImage(restart_img);
  gameOver.scale = 0.5;
  restart.scale = 0.5;
}

function draw() {
  background("White");
 
  trex.collide(invisible_ground);
  
  text("score = " + score,450,20);
  
  
  if(gameState === PLAY){
    
    console.log(trex.y);
    
    if(ground.x<0){
     ground.x = ground.width/2;
   }

    if(keyDown("space") && trex.y>=167){
      trex.velocityY = -10; 
      jump_sound.play();  
    }
    
    trex.velocityY = trex.velocityY + 0.5;
    
    
    score = score + Math.round(getFrameRate()/60); 
    
    ground.velocityX = -3;
    
    if(score % 100 === 0 && score > 0){
      checkPoint_sound.play(); 
    }
    
    if(trex.isTouching(obstacle_group)){
      gameState = END;
      dead_sound.play();
    }
    spawnClouds();
    spawnObstacles();
    
    gameOver.visible = false;
    restart.visible = false;
  }
  
  else if(gameState === END){
    ground.velocityX = 0;
    cloud_group.setVelocityXEach(0);
    obstacle_group.setVelocityXEach(0);
    cloud_group.setLifetimeEach(-1);
    obstacle_group.setLifetimeEach(-1);
    trex.changeAnimation("dead",trex_collided);
    gameOver.visible = true;
    restart.visible = true;
  }
  
  if(mousePressedOver(restart)){
    reset();
  }
  
  drawSprites();
}

function spawnClouds(){
  if(frameCount % 80 === 0){
  cloud = createSprite(600,50,10,10);
  cloud.y = Math.round(random(50,100));
  cloud.addImage(cloud_img);
  cloud.scale = 0.5;
  cloud.velocityX = -3;
  cloud.lifetime = 200;
  cloud_group.add(cloud);
  }

}

function spawnObstacles(){
  if(frameCount % 100 === 0){
    obstacles = createSprite(600,165,10,10);
    obstacles.scale = 0.5;
    obstacles.velocityX = -3;
    obstacles.lifetime = 200;
    obstacle_group.add(obstacles);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacles.addImage(obstacle_1);
      break;
      case 2: obstacles.addImage(obstacle_2);
        break;
        case 3: obstacles.addImage(obstacle_3);
        break;
        case 4: obstacles.addImage(obstacle_4);
        break;
        case 5: obstacles.addImage(obstacle_5);
        break;
        case 6: obstacles.addImage(obstacle_6);
        break;
        default: break;
    }
    
  }
}

function reset(){
  score = 0;
  gameState = PLAY;
  obstacle_group.destroyEach();
  cloud_group.destroyEach();
  trex.changeAnimation("running",trex_running);
}