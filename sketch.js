/*

The Game Project 8 - Make it Awesome

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var treePos_y;
var treeLine;
var treeLineTrees;


var canyon;
var canyonScream;

var collectable;
var coinFX;

var sun;

var enemy;

var easterEgg;

var timerValue = 60;

var flagpole;
var rocketFX;

var backgroundMusic;
var BGM_ON = false;

var game_score;
var lives;
var gameOverFX;

var falloutBits = [];


function preload()
{
    soundFormats('mp3', 'wav')
    
    backgroundMusic = loadSound('assets/backgroundMusic.mp3');
    
    coinFX = loadSound('assets/coinFX.mp3');
    coinFX.setVolume(0.25)
    
    rocketFX = loadSound('assets/rocketFX.mp3');
    rocketFX.setVolume(0.15);
    
    canyonScream = loadSound('assets/canyonScream.wav');
    canyonScream.setVolume(0.1);
    
    gameOverFX = loadSound('assets/GameOver.wav');
    gameOverFX.setVolume(0.2);
    
    jumpFX = loadSound('assets/jumpFX.wav')
    
    rocketImg = loadImage('../assets/rocket.png');
    asteroidImg = loadImage('../assets/asteroid.png');    
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    

        
    // Lives---------------------------------------------------------------------------------------------------------
    
    lives = 4
    if (lives > 0)
    {
        startGame()
        setInterval(timeIt, 1000);
    }
    
}
    //Sun-----------------------------------------------------------------------------------------------------------
    sun = {x_pos: 512,
           y_pos: 144,
           size: 1};

    easterEgg = {x_pos: -1000,
                y_pos: 100};


function draw()
{
    if (gameChar_y > height)
    {
        startGame()
    }
    
	//Sky-----------------------------------------------------------------------------------------------------------
	background(254,216,193);
    
    //Sun-----------------------------------------------------------------------------------------------------------
    noStroke()
    fill(255,255,255,75);
    ellipse(sun.x_pos, sun.y_pos, sun.size * 300, sun.size *300);
    fill(255,255,255);
    ellipse(sun.x_pos, sun.y_pos, sun.size * 175, sun.size * 175);

	noStroke();
	fill(128, 0, 0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
    
    push();
    translate(scrollPos, 0)


	// Call Draw Mountains------------------------------------------------------------------------------------------
    
    drawMountain();
    
    //Call Cloud function-------------------------------------------------------------------------------------------
    
    drawCloud();
   
    //Call Tree Line Trees Function---------------------------------------------------------------------------------
    
    drawTreeLineTrees();

    //Call Tree Line Function---------------------------------------------------------------------------------------
    
    drawTreeLine();

	//Call Draw Trees-----------------------------------------------------------------------------------------------
    
    drawTrees();
    
    //Call Enemy----------------------------------------------------------------------------------------------------
    drawEnemy()
    checkEnemy()
    
    //Draw & Check Flagpole-----------------------------------------------------------------------------------------
    drawFlagpole();
    checkFlagpole();

	//Call Draw & Check Canyons-------------------------------------------------------------------------------------
    for(var i = 0; i < Canyon.length; i++)
      {
          drawCanyon(Canyon[i]);
          checkCanyon(Canyon[i]);
      }

	// Call Draw & Check Collectable Items--------------------------------------------------------------------------
    for(var i = 0; i < Collectable.length; i++)
    {
        if(!Collectable[i].isFound)
        {
            drawCollectable(Collectable[i]);
            checkCollectable(Collectable[i]);
        }
    }
    
    //Easter Egg-----------------------------------------------------------------------------------------------------------
    noStroke()
    fill(255);
    rect(easterEgg.x_pos, easterEgg.y_pos, 300, 50);
    fill(0)
    text("Jump, I dare you", easterEgg.x_pos + 40, easterEgg.y_pos + 30)

    
    pop();
    
    let t = frameCount / 180; // update time

    // create a random number of falloutBits each frame
    for (var i = 0; i < random(5); i++) 
    {
        falloutBits.push(new fallout()); // append fallout object
    }

    // loop through falloutBits with a for..of loop
    for (let bit of falloutBits) 
    {
        bit.update(t); // update fallout position
        bit.display(); // draw fallout
    } 

    //Start Text---------------------------------------------------------------------------------------------------
    let textTime = millis();

    if(textTime < 5000){
        fill(255, 0, 0);
        textSize(32);
        text("Escape to the Rocket before the meteor hits!", width/4-50, 100);
        textSize(20);
        text("Press any button to start", width/2-100, 130);
    }
    
    //Score---------------------------------------------------------------------------------------------------------
    fill(0);
    textSize(25);
    text('Score: ' + game_score , 10 , 25)
    
    //Lives Text----------------------------------------------------------------------------------------------------
    textSize(25);
    text('Lives: ' + lives , width - 100 , 25)
    
    //Timer---------------------------------------------------------------------------------------------------------

    if (timerValue >= 10) 
    {
    fill(0)
    text("Time till Meteor Hits: 0:" + timerValue, 10, 50);
    }
    
    if (timerValue < 10) 
    {
    text('Time till Meteor Hits: 0:0' + timerValue, 10, 50);
    }
    
    if (timerValue == 0 && flagpole.Reached == false) 
    {
    lives = 0
    }
    
    if (timerValue == 0)
    {
        rocketFX.stop()
    }
    
    if (lives < 1){
        fill(255, 0, 0)
        textSize(100);
        text('GAME OVER' , width/2 -325 , height/2)
        backgroundMusic.stop()
        if(!gameOverFX.isPlaying()){
        gameOverFX.play()
        }
        return
    }
    
    if (flagpole.y_pos <= -300)
    {
        rocketFX.stop()
    }
    
    if (flagpole.Reached == true)
    {
        fill( 0 ,128 ,  0 )
        textSize(100);
        text('Congratulations!' , width/2 -350 , height/2)
        text('You Escaped!' , width/2 -300 , 400)
        backgroundMusic.stop()
        if(!gameOverFX.isPlaying()){
        rocketFX.play()
        flagpole.y_pos = flagpole.y_pos + 1*flagpole.speed;
        }
        return
    }
    
    // Draw game character.
	
	drawGameChar();

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	console.log("press" + keyCode);
	console.log("press" + key);   
}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// Draw Game Character------------------------------------------------------------------------------------------
    
    // Drawing Game Character Jumping Left
    if(isLeft && isFalling)
	{
    
        //legs
        strokeWeight(1);
        stroke(0)
        fill(255,200,0);
        rect(gameChar_x-10, gameChar_y-15, 7.5, 15,5);
        fill(0)
        ellipse(gameChar_x-6.25, gameChar_y-2, 7.5, 4)
        fill(255,200,0);
        //body
        strokeWeight(2);
        stroke(255,255,0);
        fill(255,200,0);
        rect(gameChar_x-15, gameChar_y-59, 20, 50, 10);
        //arms
        noStroke()
        stroke(0)
        strokeWeight(1);
        rect(gameChar_x-6, gameChar_y-50, 7.5, 17,5);
        fill(0)
        ellipse(gameChar_x-2.5, gameChar_y-47.5, 7.5, 4)
        fill(255,200,0);
        //head
        fill(155);
        stroke(0);
        rect(gameChar_x-14, gameChar_y-55, 7, 20, 5);
        //face
        noStroke()
        fill(255)
        rect(gameChar_x-11, gameChar_y-50, 1.5, 5)
        rect(gameChar_x-13, gameChar_y-40, 5, 1.5)
        //backpack
        fill(155)
        stroke(0)
        rect(gameChar_x+2, gameChar_y-45, 7, 20)
        fill(0,255,0)
        ellipse(gameChar_x+5.5, gameChar_y-30, 3, 3)
        fill(0,20,255);
        ellipse(gameChar_x+5.5, gameChar_y-35, 3, 3);
        fill(255,0,0);
        ellipse(gameChar_x+5.5, gameChar_y-40, 3, 3);
        
    pop();


	}
	else if(isRight && isFalling)
	{
        // Drawing Game Character Jumping Right 

        //legs
        strokeWeight(1);
        stroke(0)
        fill(255,200,0);
        rect(gameChar_x+2, gameChar_y-15, 7.5, 15,5);
        fill(0)
        ellipse(gameChar_x+5.75, gameChar_y-2, 7.5, 4)
        fill(255,200,0);
        //body
        strokeWeight(2);
        stroke(255,255,0);
        fill(255,200,0);
        rect(gameChar_x-7, gameChar_y-59, 20, 50, 10);
        //arms
        noStroke()
        stroke(0)
        strokeWeight(1);
        rect(gameChar_x-3, gameChar_y-50, 7.5, 17,5);
        fill(0)
        ellipse(gameChar_x+1, gameChar_y-47.50, 7.5, 4)
        fill(255,200,0);
        //head
        fill(155);
        stroke(0);
        rect(gameChar_x+5, gameChar_y-55, 7, 20, 5);
        //face
        noStroke()
        fill(255)
        rect(gameChar_x+7, gameChar_y-50, 1.5, 5)
        rect(gameChar_x+6, gameChar_y-40, 5, 1.5)
        //backpack
        fill(155)
        stroke(0)
        rect(gameChar_x-11, gameChar_y-45, 7, 20)
        fill(0,255,0)
        ellipse(gameChar_x-7.75, gameChar_y-30, 3, 3)
        fill(0,20,255)
        ellipse(gameChar_x-7.75, gameChar_y-35, 3, 3)
        fill(255,0,0)
        ellipse(gameChar_x-7.75, gameChar_y-40, 3, 3)

    pop();
        
    }else if(isRight)
        {
        // Drawing Game Character Walking Right

        //legs
        strokeWeight(1);
        stroke(0)
        fill(255,200,0);
        rect(gameChar_x+2, gameChar_y-15, 7.5, 15,5);
        fill(0)
        ellipse(gameChar_x+5.75, gameChar_y-2, 7.5, 4)
        fill(255,200,0);
        //body
        strokeWeight(2);
        stroke(255,255,0);
        fill(255,200,0);
        rect(gameChar_x-7, gameChar_y-59, 20, 50, 10);
        //arms
        noStroke()
        stroke(0)
        strokeWeight(1);
        rect(gameChar_x, gameChar_y-35, 7.5, 17,5);
        fill(0)
        ellipse(gameChar_x+3.75, gameChar_y-20, 7.5, 4)
        fill(255,200,0);
        //head
        fill(155);
        stroke(0);
        rect(gameChar_x+5, gameChar_y-55, 7, 20, 5);
        //face
        noStroke()
        fill(255)
        rect(gameChar_x+7, gameChar_y-50, 1.5, 5)
        rect(gameChar_x+6, gameChar_y-40, 5, 1.5)
        //backpack
        fill(155)
        stroke(0)
        rect(gameChar_x-11, gameChar_y-45, 7, 20)
        fill(0,255,0)
        ellipse(gameChar_x-7.75, gameChar_y-30, 3, 3)
        fill(0,20,255)
        ellipse(gameChar_x-7.75, gameChar_y-35, 3, 3)
        fill(255,0,0)
        ellipse(gameChar_x-7.75, gameChar_y-40, 3, 3)
            
    pop();

	}
	else if(isLeft)
	{
        // Drawing Game Character Walking Left

        //legs
        strokeWeight(1);
        stroke(0)
        fill(255,200,0);
        rect(gameChar_x-10, gameChar_y-15, 7.5, 15,5);
        fill(0)
        ellipse(gameChar_x-6.25, gameChar_y-2, 7.5, 4)
        fill(255,200,0);
        //body
        strokeWeight(2);
        stroke(255,255,0);
        fill(255,200,0);
        rect(gameChar_x-15, gameChar_y-59, 20, 50, 10);
        //arms
        noStroke()
        stroke(0)
        strokeWeight(1);
        rect(gameChar_x-9, gameChar_y-35, 7.5, 17,5);
        fill(0)
        ellipse(gameChar_x-5.5, gameChar_y-20, 7.5, 4)
        fill(255,200,0);
        //head
        fill(155);
        stroke(0);
        rect(gameChar_x-14, gameChar_y-55, 7, 20, 5);
        //face
        noStroke()
        fill(255)
        rect(gameChar_x-11, gameChar_y-50, 1.5, 5)
        rect(gameChar_x-13, gameChar_y-40, 5, 1.5)
        //backpack
        fill(155)
        stroke(0)
        rect(gameChar_x+2, gameChar_y-45, 7, 20)
        fill(0,255,0)
        ellipse(gameChar_x+5.5, gameChar_y-30, 3, 3)
        fill(0,20,255)
        ellipse(gameChar_x+5.5, gameChar_y-35, 3, 3)
        fill(255,0,0)
        ellipse(gameChar_x+5.5, gameChar_y-40, 3, 3)

    pop();

	}
	else if(isFalling || isPlummeting)
	{
        // Drawing Game Character Jumping Facing Forwards

        //legs
        strokeWeight(1);
        stroke(0)
        fill(255,200,0);
        rect(gameChar_x-10, gameChar_y-15, 7.5, 12,5);
        rect(gameChar_x+3, gameChar_y-15, 7.5, 12,5);
        fill(0)
        ellipse(gameChar_x-6.25, gameChar_y-5, 7.5, 4)
        ellipse(gameChar_x+6.75, gameChar_y-5, 7.5, 4)
        fill(255,200,0);
        //body
        strokeWeight(2);
        stroke(255,255,0);
        fill(255,200,0);
        rect(gameChar_x-15, gameChar_y-59, 30, 50, 7.5);
        //arms
        noStroke()
        stroke(0)
        strokeWeight(1);
        rect(gameChar_x-17.5, gameChar_y-50, 7.5, 17,5);
        rect(gameChar_x+10, gameChar_y-50, 7.5, 17,5);
        fill(0)
        ellipse(gameChar_x-13.75, gameChar_y-47.5, 7.5, 4)
        ellipse(gameChar_x+13.75, gameChar_y-47.5, 7.5, 4)
        fill(255,200,0);
        //head
        fill(155);
        stroke(0);
        rect(gameChar_x-10, gameChar_y-55, 20, 20, 5);
        //logo
        noStroke()
        fill(0)
        triangle(gameChar_x, gameChar_y-25, gameChar_x-3.5, gameChar_y-30, gameChar_x-6.5, gameChar_y-25)
        triangle(gameChar_x, gameChar_y-25, gameChar_x+3.5, gameChar_y-30, gameChar_x+6.5, gameChar_y-25)
        triangle(gameChar_x, gameChar_y-25, gameChar_x-3, gameChar_y-19, gameChar_x+3, gameChar_y-19)
        fill(255,200,0);
        ellipse(gameChar_x, gameChar_y -25 ,4.5 ,4.5);
        fill(0);
        ellipse(gameChar_x, gameChar_y -25 ,2.5 ,2.5);
        //face
        fill(255)
        rect(gameChar_x-5, gameChar_y-50, 1.5, 5)
        rect(gameChar_x+4, gameChar_y-50, 1.5, 5)
        rect(gameChar_x-4, gameChar_y-40, 10, 1.5)
        
    pop();
        
	}
	else
	{
        // Drawing Game Character Standing Front Facing

        //legs
        strokeWeight(1);
        stroke(0)
        fill(255,200,0);
        rect(gameChar_x-10, gameChar_y-15, 7.5, 15,5);
        rect(gameChar_x+3, gameChar_y-15, 7.5, 15,5);
        fill(0)
        ellipse(gameChar_x-6.25, gameChar_y-2, 7.5, 4)
        ellipse(gameChar_x+6.75, gameChar_y-2, 7.5, 4)
        fill(255,200,0);
        //body
        strokeWeight(2);
        stroke(255,255,0);
        fill(255,200,0);
        rect(gameChar_x-15, gameChar_y-59, 30, 50, 7.5);
        //arms
        noStroke()
        stroke(0)
        strokeWeight(1);
        rect(gameChar_x-17.5, gameChar_y-35, 7.5, 17,5);
        rect(gameChar_x+10, gameChar_y-35, 7.5, 17,5);
        fill(0)
        ellipse(gameChar_x-13.75, gameChar_y-20, 7.5, 4)
        ellipse(gameChar_x+13.75, gameChar_y-20, 7.5, 4)
        fill(255,200,0);
        //head
        fill(155);
        stroke(0);
        rect(gameChar_x-10, gameChar_y-55, 20, 20, 5);
        //logo
        noStroke()
        fill(0)
        triangle(gameChar_x, gameChar_y-25, gameChar_x-3.5, gameChar_y-30, gameChar_x-6.5, gameChar_y-25)
        triangle(gameChar_x, gameChar_y-25, gameChar_x+3.5, gameChar_y-30, gameChar_x+6.5, gameChar_y-25)
        triangle(gameChar_x, gameChar_y-25, gameChar_x-3, gameChar_y-19, gameChar_x+3, gameChar_y-19)
        fill(255,200,0);
        ellipse(gameChar_x, gameChar_y -25 ,4.5 ,4.5);
        fill(0);
        ellipse(gameChar_x, gameChar_y -25 ,2.5 ,2.5);
        //face
        fill(255)
        rect(gameChar_x-5, gameChar_y-50, 1.5, 5)
        rect(gameChar_x+4, gameChar_y-50, 1.5, 5)
        rect(gameChar_x-4, gameChar_y-40, 10, 1.5)
        
    pop();
}

    
    ///////////INTERACTION CODE//////////
    
    //Walking Left Animation----------------------------------------------------------------------------------------
    if(isLeft)
        {
            gameChar_world_x -= 1
        }
    
    //Walking Right Animation---------------------------------------------------------------------------------------
    if(isRight)
        {
            gameChar_world_x += 1
        }
    
    //Jumping Animation---------------------------------------------------------------------------------------------
    if(isFalling && gameChar_y == floorPos_y)
        {
            gameChar_y -= 120
        }
    
    //Gravity Animation---------------------------------------------------------------------------------------------
    if(gameChar_y < floorPos_y)
        gameChar_y += 3

}

// Code To Assign The Buttons (Pressed)---------------------------------------------------------------------------------
function keyPressed()
{

	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
    
    if (keyCode == 65 || keyCode == 37) //A or Left Arrow
        {
            isLeft = true
        }
    
    if (keyCode == 68 || keyCode == 39) //D or Right Arrow
        {
            isRight = true
        }
    
    if (keyCode == 87 || keyCode == 32 || keyCode == 38) //W or Spacebar or Up Arrow
        {
            isFalling = true
            jumpFX.play()
        }
    if(BGM_ON == false) //turns on music as player starts moving.
        {
            backgroundMusic.play();
            backgroundMusic.setVolume(0.25)
            BGM_ON = true;
        }
    
}

// Code To Assign The Buttons (Released)--------------------------------------------------------------------------------
function keyReleased()
{

    console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if (keyCode == 65 || keyCode == 37) //A or Left Arrow
        {
            isLeft = false
        }
    if (keyCode == 68 || keyCode == 39) //D or Right Arrow
        {
            isRight = false
        }
    if (keyCode == 87 || keyCode == 32 || keyCode == 38) //W or Spacebar or Up Arrow
        {
            isFalling = false
        }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawCloud()
{
    // Draw Clouds--------------------------------------------------------------------------------------------------
    for(var i = 0; i < cloud.length; i++)
    {
        cloud[i].x_pos = cloud[i].x_pos-1*cloud[i].speed; //move cloud
        if(cloud[i].x_pos < gameChar_world_x - 850 || cloud[i].x_pos > gameChar_world_x +850 )
        {
            cloud[i].x_pos = gameChar_world_x + 850;
        }
        
    fill(255);
    
    //Cloud 1
    ellipse(cloud[i].x_pos - 65, cloud[i].y_pos, cloud[i].size * 30, cloud[i].size * 30);
        
    ellipse(cloud[i].x_pos - 50, cloud[i].y_pos, cloud[i].size * 40, cloud[i].size * 40);
        
    ellipse(cloud[i].x_pos - 35, cloud[i].y_pos, cloud[i].size * 30, cloud[i].size * 30);
    
    //Cloud 2
    ellipse(cloud[i].x_pos - 15, cloud[i].y_pos + 50, cloud[i].size * 30, cloud[i].size * 30);
    ellipse(cloud[i].x_pos, cloud[i].y_pos + 50, cloud[i].size * 40, cloud[i].size * 40);
    ellipse(cloud[i].x_pos + 15, cloud[i].y_pos + 50, cloud[i].size * 30, cloud[i].size * 30);
    
    //Cloud 3
    ellipse(cloud[i].x_pos + 35, cloud[i].y_pos, cloud[i].size * 30, cloud[i].size * 30);
    ellipse(cloud[i].x_pos + 50, cloud[i].y_pos, cloud[i].size * 40, cloud[i].size * 40);
    ellipse(cloud[i].x_pos + 65, cloud[i].y_pos, cloud[i].size * 30, cloud[i].size * 30);
    }
}

// Function to draw mountains objects.

function drawMountain()
{
   // Draw Mountains-----------------------------------------------------------------------------------------------
    for(var i = 0; i < mountain.length; i++)
    {
    //Right Mountain
    fill(255,99,71);
    triangle(mountain[i].x_pos + 88, mountain[i].Y_pos, 
             mountain[i].x_pos + 288,  mountain[i].Y_pos - 175, 
             mountain[i].x_pos + 738,  mountain[i].Y_pos);

    fill(255,127,80);
    triangle(mountain[i].x_pos + 288,  mountain[i].Y_pos - 175, 
             mountain[i].x_pos + 388,  mountain[i].Y_pos, 
             mountain[i].x_pos + 738,  mountain[i].Y_pos);

    //Left Mountain
    fill(255,99,71);
    triangle(mountain[i].x_pos - 412,  mountain[i].Y_pos, 
             mountain[i].x_pos - 212,  mountain[i].Y_pos - 155, 
             mountain[i].x_pos - 112,  mountain[i].Y_pos);

    fill(255,127,80);
    triangle(mountain[i].x_pos - 612,  mountain[i].Y_pos, 
             mountain[i].x_pos - 384,  mountain[i].Y_pos - 180, 
             mountain[i].x_pos - 212,  mountain[i].Y_pos);

    fill(255,99,71);
    triangle(mountain[i].x_pos - 612,  mountain[i].Y_pos,
             mountain[i].x_pos - 385,  mountain[i].Y_pos - 180, 
             mountain[i].x_pos - 302,  mountain[i].Y_pos);

    //Center Mountain
    fill(255,127,80);
    triangle(mountain[i].x_pos - 384,  mountain[i].Y_pos, 
             mountain[i].x_pos,  mountain[i].Y_pos - 233, 
             mountain[i].x_pos + 384,  mountain[i].Y_pos);

    fill(255,99,71);
    triangle(mountain[i].x_pos - 385,  mountain[i].Y_pos, 
             mountain[i].x_pos,  mountain[i].Y_pos - 231,
             mountain[i].x_pos + 188,  mountain[i].Y_pos);
    } 
}


//Function to draw the trees in the background
function drawTreeLineTrees()
{
    //Tree Line Trees---------------------------------------------------------------------------------------------
    for(var i = 0; i < treeLineTrees.length; i++)
    {
    fill(239,67,53)
    triangle(treeLineTrees[i].x_pos + 63, treeLineTrees[i].y_pos - 140,
             treeLineTrees[i].x_pos + 80.5, treeLineTrees[i].y_pos - 165, 
             treeLineTrees[i].x_pos + 98, treeLineTrees[i].y_pos - 140);
    
    triangle(treeLineTrees[i].x_pos + 65.5, treeLineTrees[i].y_pos - 155, 
             treeLineTrees[i].x_pos + 80.5, treeLineTrees[i].y_pos - 180, 
             treeLineTrees[i].x_pos + 95.5, treeLineTrees[i].y_pos - 155);
    
    triangle(treeLineTrees[i].x_pos + 68, treeLineTrees[i].y_pos - 170, 
             treeLineTrees[i].x_pos + 80.5, treeLineTrees[i].y_pos - 185, 
             treeLineTrees[i].x_pos + 93, treeLineTrees[i].y_pos - 170);
    
    rect(treeLineTrees[i].x_pos + 78, treeLineTrees[i].y_pos - 155, 5, 40);
    }
}

//Function to draw the hill in the background
function drawTreeLine()
{
    //Tree Line-----------------------------------------------------------------------------------------------------
    for(var i = 0; i < treeLine.length; i++)
    {
    rect(treeLine[i].x_pos, 320, 200, 114)
    triangle(treeLine[i].x_pos - 522, treeLine[i].y_pos - 125, 
             treeLine[i].x_pos, treeLine[i].y_pos - 1, 
             treeLine[i].x_pos - 522, treeLine[i].y_pos - 1)
    
    triangle(treeLine[i].x_pos, treeLine[i].y_pos - 115, 
             treeLine[i].x_pos, treeLine[i].y_pos - 1, 
             treeLine[i].x_pos - 522, treeLine[i].y_pos - 1)
    
    
    triangle(treeLine[i].x_pos + 200, treeLine[i].y_pos - 115, 
             treeLine[i].x_pos + 190, treeLine[i].y_pos - 1, 
             treeLine[i].x_pos + 878, treeLine[i].y_pos - 1)
    
    rect(treeLine[i].x_pos, treeLine[i].y_pos - 115, 200, 114)
    }
}

// Function to draw trees objects.

function drawTrees()
{
   // Draw Trees---------------------------------------------------------------------------------------------------
    for(var i = 0; i < trees_x.length; i++)
    {
        fill(210,105,30);
    rect(trees_x[i] - 15, treePos_y - 50, 30, 50);
    
    fill(80, 0, 20);
    triangle(trees_x[i] - 35, treePos_y - 120, 
             trees_x[i], treePos_y - 180, 
             trees_x[i] + 35, treePos_y - 120);
    
    triangle(trees_x[i] - 45, treePos_y - 85, 
             trees_x[i], treePos_y - 150, 
             trees_x[i] + 45, treePos_y - 85);
    
    triangle(trees_x[i] - 65, treePos_y - 40, 
             trees_x[i], treePos_y - 120, 
             trees_x[i] + 65, treePos_y - 40);
    }
 
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(125)
    noStroke()
    rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, 142)

    //Lava in Canyon
    fill(255, 69, 5)
    rect(t_canyon.x_pos + 25, t_canyon.y_pos, t_canyon.width - 50, 142)
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
{

    isPlummeting = true;
}

     if(isPlummeting)
        {
            isPlummeting = true;
            gameChar_y += 5;
        }
    if(isPlummeting == true)
        {
            canyonScream.play()
        }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    stroke(0);
    strokeWeight(1);
    fill(255,223,0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size * 15, t_collectable.size * 20);
    fill(212,175,55);
    rect(t_collectable.x_pos - 1.5, t_collectable.y_pos - 5, t_collectable.size * 2.5, t_collectable.size * 10);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
    
    if(d < 40)
    {
        t_collectable.isFound = true;    
        game_score += 1
        coinFX.play();
    }
    
}

function drawEnemy()
{
    // Draw Enemies--------------------------------------------------------------------------------------------------
    for(var i = 0; i < enemy.length; i++)
    {
        image(asteroidImg, enemy[i].x_pos, enemy[i].y_pos = enemy[i].y_pos + enemy[i].speed  , 60 , 80)
        if (enemy[i].y_pos > height)
        {
            enemy[i].y_pos = 0
        }  
    }
}
   
function checkEnemy()
{
    for (var i = 0 ; i < enemy.length ; i++)
    {
        if ((int(enemy[i].x_pos)- 40 < gameChar_world_x &&  gameChar_world_x < int(enemy[i].x_pos) +40 ) && (int(enemy[i].y_pos)- 40 < gameChar_y  && gameChar_y <  int(enemy[i].y_pos) + 100))
        {
            startGame()
        }
    }
}
//Flagpole-----------------------------------------------------------------------------------------------------------------

function drawFlagpole()
{
    image(rocketImg, flagpole.x_pos, flagpole.y_pos, 200, 300, flagpole.Reached)
}
function checkFlagpole(){

    if (gameChar_world_x >= flagpole.x_pos + 50)
    {
        flagpole.Reached = true
    } 
}


function startGame(){
    gameChar_x = width/2
	gameChar_y = floorPos_y;
    
    // Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    isJumping = false
    
    
       
    //Clouds--------------------------------------------------------------------------------------------------------
    cloud = [
        {x_pos: 100, y_pos: 50, size: 1, speed : -0.5},
        {x_pos: 300, y_pos: 100, size: 1, speed: 0.5},
        {x_pos: 725, y_pos: 50, size: 1, speed: -0.5},
        {x_pos: 925, y_pos: 100, size: 1, speed: 0.5},
        
        //Scroll Right
        {x_pos: 1300, y_pos: 50, size: 1, speed : -0.5},
        {x_pos: 1500, y_pos: 100, size: 1, speed: 0.5},
        {x_pos: 1725, y_pos: 50, size: 1, speed : -0.5},
        {x_pos: 1925, y_pos: 100, size: 1, speed: 0.5},
        
        {x_pos: 2300, y_pos: 50, size: 1, speed : -0.5},
        {x_pos: 2500, y_pos: 100, size: 1, speed: 0.5},
        {x_pos: 2725, y_pos: 50, size: 1, speed : -0.5},
        {x_pos: 2925, y_pos: 100, size: 1, speed: 0.5},
        
        //Scroll Left
        {x_pos: -100, y_pos: 100, size: 1, speed : 0.5},
        {x_pos: -300, y_pos: 50, size: 1, speed: -0.5},
        {x_pos: -725, y_pos: 100, size: 1, speed : 0.5},
        {x_pos: -925, y_pos: 50, size: 1, speed: -0.5}
     ];
    
    //Moutains------------------------------------------------------------------------------------------------------
    mountain = [
        {x_pos: 512, Y_pos: 375},
        {x_pos: 612, Y_pos: 375},
        {x_pos: 412, Y_pos: 375},
        
        //Scroll Right
        {x_pos: 1512, Y_pos: 375},
        {x_pos: 1612, Y_pos: 375},
        {x_pos: 1412, Y_pos: 375},
        {x_pos: 2512, Y_pos: 375},
        {x_pos: 2612, Y_pos: 375},
        {x_pos: 2412, Y_pos: 375},
        
        //Scroll Left
        {x_pos: -512, Y_pos: 375},
        {x_pos: -612, Y_pos: 375},
        {x_pos: -412, Y_pos: 375},
    ];
    
    //Trees---------------------------------------------------------------------------------------------------------
    trees_x = [50, 350, 500, 650, 1000,
               
               //Scroll Right
               1350, 1650, 1800, 1950,
               
               //Scroll Left
              -50, -350, -500, -650, -1300];
    treePos_y = floorPos_y;
    
    //Tree Line-----------------------------------------------------------------------------------------------------
    treeLine = [
        {x_pos: 512, y_pos: 435},
        
        //Scroll Right
        {x_pos: 1512, y_pos: 435},
        {x_pos: 2512, y_pos: 435},
        
        //Scroll Left
        {x_pos: -512, y_pos: 435}
    ];
    
    //Tree Line Trees-----------------------------------------------------------------------------------------------
    treeLineTrees = [
        {x_pos: -50, y_pos: 445},
        {x_pos: 0, y_pos: 455},
        {x_pos: 50, y_pos: 465},
        {x_pos: 100, y_pos: 475},
        {x_pos: 200, y_pos: 500},
        {x_pos: 320, y_pos: 475},
        {x_pos: 420, y_pos: 465},
        {x_pos: 420, y_pos: 450},
        {x_pos: 460, y_pos: 445},
        {x_pos: 560, y_pos: 445},
        {x_pos: 600, y_pos: 445},
        {x_pos: 640, y_pos: 445},
        {x_pos: 725, y_pos: 460},
        {x_pos: 775, y_pos: 470},
        {x_pos: 900, y_pos: 485},
        
        //Scroll Right
        {x_pos: 950, y_pos: 445},
        {x_pos: 1000, y_pos: 455},
        {x_pos: 1050, y_pos: 465},
        {x_pos: 1100, y_pos: 475},
        {x_pos: 1200, y_pos: 500},
        {x_pos: 1320, y_pos: 475},
        {x_pos: 1420, y_pos: 465},
        {x_pos: 1420, y_pos: 450},
        {x_pos: 1460, y_pos: 445},
        {x_pos: 1560, y_pos: 445},
        {x_pos: 1600, y_pos: 445},
        {x_pos: 1640, y_pos: 445},
        {x_pos: 1725, y_pos: 460},
        {x_pos: 1775, y_pos: 470},
        {x_pos: 1900, y_pos: 485},
        {x_pos: 1950, y_pos: 445},
        {x_pos: 2000, y_pos: 455},
        {x_pos: 2050, y_pos: 465},
        {x_pos: 2100, y_pos: 475},
        {x_pos: 2200, y_pos: 500},
        {x_pos: 2320, y_pos: 475},
        {x_pos: 2420, y_pos: 465},
        {x_pos: 2420, y_pos: 450},
        {x_pos: 2460, y_pos: 445},
        {x_pos: 2560, y_pos: 445},
        {x_pos: 2600, y_pos: 445},
        {x_pos: 2640, y_pos: 445},
        {x_pos: 2725, y_pos: 460},
        {x_pos: 2775, y_pos: 470},
        {x_pos: 2900, y_pos: 485},
        
        //Scroll Left
        {x_pos: -50, y_pos: 445},
        {x_pos: 0, y_pos: 455},
        {x_pos: 50, y_pos: 465},
        {x_pos: -100, y_pos: 475},
        {x_pos: -200, y_pos: 500},
        {x_pos: -320, y_pos: 475},
        {x_pos: -420, y_pos: 465},
        {x_pos: -420, y_pos: 450},
        {x_pos: -460, y_pos: 445},
        {x_pos: -560, y_pos: 445},
        {x_pos: -600, y_pos: 445},
        {x_pos: -640, y_pos: 445},
        {x_pos: -725, y_pos: 460},
        {x_pos: -775, y_pos: 470},
        {x_pos: -900, y_pos: 485}
    ];
    
    //Canyon--------------------------------------------------------------------------------------------------------
     Canyon = [
        {x_pos: 130, y_pos: 434, width: 100}, 
        {x_pos: 740, y_pos: 434, width: 120},
         
        //Scroll Right
        {x_pos: 1030, y_pos: 434, width: 120}, 
        {x_pos: 1430, y_pos: 434, width: 120},
         
        {x_pos: 1630, y_pos: 434, width: 120},
        {x_pos: 1830, y_pos: 434, width: 100},
        {x_pos: 2030, y_pos: 434, width: 120},

         
         //Scroll Left
        {x_pos: -130, y_pos: 434, width: 120}, 
        {x_pos: -740, y_pos: 434, width: 120},
        {x_pos: -1140, y_pos: 434, width: 300},

    ];
    
    //Collectable---------------------------------------------------------------------------------------------------
    Collectable = [
        {x_pos: 110, y_pos: 400, size: 1},
        {x_pos: 180, y_pos: 350, size: 1},
        {x_pos: 250, y_pos: 400, size: 1},
        {x_pos: 425, y_pos: 400, size: 1},
        {x_pos: 575, y_pos: 400, size: 1},
        {x_pos: 700, y_pos: 400, size: 1},
        {x_pos: 800, y_pos: 350, size: 1},
        {x_pos: 900, y_pos: 400, size: 1},
        
        //Scroll Right
        {x_pos: 1000, y_pos: 400, size: 1},
        {x_pos: 1100, y_pos: 350, size: 1},
        {x_pos: 1200, y_pos: 400, size: 1},
        {x_pos: 1390, y_pos: 400, size: 1},
        {x_pos: 1490, y_pos: 350, size: 1},
        {x_pos: 1590, y_pos: 400, size: 1},
            
        {x_pos: 1690, y_pos: 350, size: 1},
        {x_pos: 1790, y_pos: 400, size: 1},
        {x_pos: 1880, y_pos: 350, size: 1},
        {x_pos: 1970, y_pos: 400, size: 1},
        {x_pos: 2090, y_pos: 350, size: 1},
        {x_pos: 2190, y_pos: 400, size: 1},
        
        //Scroll Left
        {x_pos: -200, y_pos: 350, size: 1},
        {x_pos: -600, y_pos: 400, size: 1},
        {x_pos: -800, y_pos: 350, size: 1}
    ];
    
    enemy = [
        {x_pos:150, y_pos: 0, speed: 5},
        {x_pos:775, y_pos: -200, speed: 5},
        {x_pos:1065, y_pos: -100, speed: 5},
        {x_pos:1460, y_pos: -200, speed: 5},
        {x_pos:1660, y_pos: -300, speed: 5},
        {x_pos:1850, y_pos: -200, speed: 5},
        {x_pos:2065, y_pos: -100, speed: 5},
        {x_pos:2300, y_pos: -100, speed: 5},
        {x_pos:2350, y_pos: -200, speed: 5},
        {x_pos:2400, y_pos: -300, speed: 5},
        {x_pos:2450, y_pos: -400, speed: 5}
    ];
    
    flagpole = {x_pos:2500, y_pos:floorPos_y - 300, Reached : false, speed: -1};
    
    game_score = 0
    lives -=1
}

function fallout() 
{
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(1, 5);

  // radius of fallout spiral
  // chosen so the falloutBits are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
  // x position follows a circle
  let w = 0.6; // angular speed
  let angle = w * time + this.initialangle;
  this.posX = width / 2 + this.radius * sin(angle);

 // different size falloutBits fall at slightly different y speeds
  this.posY += pow(this.size, 0.5);

  // delete fallout if past end of screen
  if (this.posY > height) 
  {
      let index = falloutBits.indexOf(this);
      falloutBits.splice(index, 1);
  }
  };

  this.display = function() 
  {
        ellipse(this.posX, this.posY, this.size);
  };
}

function timeIt() {
  if (timerValue > 0) {
    timerValue--;
  }
}
