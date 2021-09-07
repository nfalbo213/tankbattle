///////////////////////////////////////////////////

///////////////////
// Global Variables

// Tank Variables

let firstExplosion;
let secondExplosion;
let muzzleFire;

firstExplosion = new Image(95, 55);
firstExplosion.src = './Explosion.png';
secondExplosion = new Image(95, 55);
secondExplosion.src = './ExplosionReverse.png';

muzzleFire = new Image(25, 15);
muzzleFire.src = './ExplosionReverse.png';

let tanTankImg;

tanTankImg = new Image(80, 40);
tanTankImg.src = './TanTankRight.png';

// Ensure Tanks individually face player when turning by creating specific image and then utilizing darkTankPosition[i].facingLeft in drawEachDarkTank()
let darkTankImgLeft;
let darkTankImgRight;

darkTankImgLeft = new Image(80, 40);
darkTankImgLeft.src ='./DarkTankLeft.png';

darkTankImgRight = new Image(80, 40);
darkTankImgRight.src ='./DarkTankRight.png';

let bossCrownImg;

bossCrownImg = new Image(30, 25);
bossCrownImg.src ='./BossCrown.png'

let tanTankPosition = [];
let darkTankPosition = [];

// Munitions Variables
// [{x: (tankPosition[i].x - number), y: (tankPosition[i].y - number), velocity: negative number or positive along x axis}]
let tankRoundArr = [];

let roundFired = false;

// Gameboard Variables

const battlefield = document.getElementById('battlefield');
const battlefield_ctx = battlefield.getContext("2d");

const battlefieldBorder = 'black';
const battlefieldBackground = 'lightgreen';

// Start Menu and gameplay-dependent object
    // Origionaly found in controls global variables
let startObj = {startClicked: false, animationPlayed: false, gameStart: false, gameOver: false, battleRoyal: false, onTouchLeft: false, onTouchUp: false, onTouchRight: false, onTouchDown: false, currentScore: 0, totalHighScoreDisplay: 25};

///////////////////
///////////////////

////////////
// Functions

// Display for Tanks

const drawTanks = () => {

    const timer = setInterval(function(){
        
        // Allows animation to continue when game over (see startMenu.onmousedown())
        if (!startObj.gameStart) {
            clearInterval(timer);
            return;
        }
        else if (!startObj.startClicked) {

            battlefield_ctx.fillStyle = battlefieldBackground;
            //  Select the colour for the border of the canvas
            battlefield_ctx.strokestyle = battlefieldBorder;
            // Draw a "filled" rectangle to cover the entire canvas
            battlefield_ctx.fillRect(0, 0, battlefield.width, battlefield.height);
            // Draw a "border" around the entire canvas
            battlefield_ctx.strokeRect(0, 0, battlefield.width, battlefield.height);
            
            leftButtonHold();
            upButtonHold();
            rightButtonHold();
            downButtonHold();
            drawEachTanTank();
            drawEachDarkTank();
            drawHealthBar();
            tankAI();

            if (roundFired === true) {
                fireRound();
                didRoundHit();
            }
            if (roundFired === false) {
                return;
            }
         
        } 
        else if (startObj.startClicked) {
            return;
        }
    }, 80);

}

const returnOrigionalTanks = () => {

    // Clear out any remaining objects in tank arrays
    tanTankPosition.splice(0, tanTankPosition.length);
    darkTankPosition.splice(0, darkTankPosition.length);
    // Clear out any remaining objects in round array
    tankRoundArr.splice(0, tankRoundArr.length);
    roundFired = false;

    // Clear out any remaining objects in destroyed tanks array from animation/battle
    destroyedTanksArr.splice(0, destroyedTanksArr.length);

    if (!startObj.battleRoyal) {

        tanTankPosition = [
            {x: -520, y: 390, facingLeft: false, health: 5}
        ];
        darkTankPosition = [
            // First Wave
            {x: battlefield.width + 100, y: 200, facingLeft: true, health: 5, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width, y: 400, facingLeft: true, health: 5, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 100, y: 650, facingLeft: true, health: 5, boss: false, roundFiredIndex: 0},
            // Second Wave
            {x: battlefield.width + 300, y: 0, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 200, y: 400, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 300, y: 800, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0},
            // Third Wave
            {x: battlefield.width + 600, y: -300, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 500, y: 0, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 400, y: 400, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0},
            {x: battlefield.width + 500, y: 800, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 600, y: 1100, facingLeft: true, health: 6, boss: false, roundFiredIndex: 0},
            // Fourth Wave
            {x: battlefield.width + 800, y: -400, facingLeft: true, health: 7, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 700, y: -100, facingLeft: true, health: 7, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 600, y: 400, facingLeft: true, health: 7, boss: false, roundFiredIndex: 0},
            {x: battlefield.width + 700, y: 900, facingLeft: true, health: 7, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 800, y: 1200, facingLeft: true, health: 7, boss: false, roundFiredIndex: 0},
            // Fifth Wave
            {x: battlefield.width + 900, y: -550, facingLeft: true, health: 8, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 800, y: -250, facingLeft: true, health: 8, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 700, y: 400, facingLeft: true, health: 8, boss: false, roundFiredIndex: 0},
            {x: battlefield.width + 900, y: 400, facingLeft: true, health: 8, boss: false, roundFiredIndex: 0},
            {x: battlefield.width + 800, y: 1050, facingLeft: true, health: 8, boss: false, roundFiredIndex: 0}, 
            {x: battlefield.width + 900, y: 1350, facingLeft: true, health: 8, boss: false, roundFiredIndex: 0},
            // Boss
            {x: battlefield.width + 1600, y: -800, facingLeft: true, health: 12, boss: true, roundFiredIndex: 0},
            {x: battlefield.width + 1500, y: -700, facingLeft: true, health: 12, boss: true, roundFiredIndex: 0},
            {x: battlefield.width + 1400, y: 400, facingLeft: true, health: 12, boss: true, roundFiredIndex: 0},
            {x: battlefield.width + 1500, y: 1500, facingLeft: true, health: 12, boss: true, roundFiredIndex: 0},
            {x: battlefield.width + 1600, y: 1600, facingLeft: true, health: 12, boss: true, roundFiredIndex: 0}  
        ];

    }
    else if (startObj.battleRoyal) {

        tanTankPosition = [
            {x: -150, y: 400, facingLeft: false, health: 7}
        ];
        generateRandomAI();
        generateRandomAI();
        generateRandomAI();
        generateRandomAI();
        generateRandomAI();

    }

}

const drawEachDarkTank = () => {

     // This loop works becasue drawEachDarkTank() is repeatedly invoked in drawTanks()
     if (darkTankPosition.length - 1 >= 0) {
    
        let i = darkTankPosition.length - 1;
        
        do {

            //Ensure Tanks individually face player when turning
            if (darkTankPosition[i].facingLeft === true) {
                battlefield_ctx.drawImage(darkTankImgLeft, darkTankPosition[i].x, darkTankPosition[i].y, darkTankImgLeft.width, darkTankImgLeft.height);
            }
            if (darkTankPosition[i].facingLeft === false) {
                battlefield_ctx.drawImage(darkTankImgRight, darkTankPosition[i].x, darkTankPosition[i].y, darkTankImgRight.width, darkTankImgRight.height);
            }
            
            i--;
            
        } while (i >= 0);
      } else {
        return;
      }

}


const drawEachTanTank = () => {

    // Below is not final solution because it ignores looping array which would stop from creating allies
    if (tanTankPosition.length > 0) {

        battlefield_ctx.drawImage(tanTankImg, tanTankPosition[0].x, tanTankPosition[0].y, tanTankImg.width, tanTankImg.height);

        if (tanTankPosition[0].facingLeft === true) {
            tanTankImg.src = "./TanTankLeft.png"
        }
        if (tanTankPosition[0].facingLeft === false) {
            tanTankImg.src = "./TanTankRight.png"
        }

        // Ensure off screen marker only happens during gameplay and not animation
        if (startObj.gameStart) {

            // Draw position marker for player if drives DOWN and LEFT off canvas
            if (tanTankPosition[0].y >= battlefield.height && tanTankPosition[0].x <= 0) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (20, battlefield.height - 40, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (20, battlefield.height - 40, 20, 20);

            }
            // Draw position marker for player if drives DOWN and RIGHT off canvas
            else if (tanTankPosition[0].y >= battlefield.height && tanTankPosition[0].x + 80 >= battlefield.width) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (battlefield.width - 40, battlefield.height - 40, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (battlefield.width - 40, battlefield.height - 40, 20, 20);

            }
            else if (tanTankPosition[0].y - 40 >= battlefield.height && tanTankPosition[0].x >= battlefield.width - 80) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (battlefield.width - 40, battlefield.height - 40, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (battlefield.width - 40, battlefield.height - 40, 20, 20);

            }
            // Draw position marker for player if drives LEFT and UP off canvas
            else if (tanTankPosition[0].y <= 0 && tanTankPosition[0].x + 80 <= 0) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (20, 20, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (20, 20, 20, 20);

            }
            // Draw position marker for player if drives UP and RIGHT off canvas
            else if (tanTankPosition[0].y <= 0 && tanTankPosition[0].x >= battlefield.width) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (battlefield.width - 40, 20, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (battlefield.width - 40, 20, 20, 20);

            }
            // Draw position marker for player if drives RIGHT off canvas
            else if (tanTankPosition[0].x >= battlefield.width) {

                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (battlefield.width - 40, tanTankPosition[0].y + 20, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (battlefield.width - 40, tanTankPosition[0].y + 20, 20, 20);

            }
            // Draw position marker for player if drives LEFT off canvas
            else if (tanTankPosition[0].x <= -80) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (20, tanTankPosition[0].y + 20, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (20, tanTankPosition[0].y + 20, 20, 20);

            }
            // Draw position marker for player if drives UP off canvas
            else if (tanTankPosition[0].y + 40 <= 0) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (tanTankPosition[0].x + 30, 20, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (tanTankPosition[0].x + 30, 20, 20, 20);

            }
            // Draw position marker for player if drives DOWN off canvas
            else if (tanTankPosition[0].y >= battlefield.height) {
                
                battlefield_ctx.fillStyle = 'tan';
                battlefield_ctx.fillRect (tanTankPosition[0].x + 30, battlefield.height - 40, 20, 20);
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.strokeRect (tanTankPosition[0].x + 30, battlefield.height - 40, 20, 20);

            }

        }

    } else {
        return;
    }

}


const drawHealthBar = () => {

    // Dark Tank health bars
    if (darkTankPosition.length -1 > -1) {

        let i = darkTankPosition.length - 1;

        do {

            if (darkTankPosition[i].health === 12) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 9); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 8);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (10 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 11) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 8); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 7);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (9 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 10) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 7); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 6);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (8 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 9) {
                battlefield_ctx.fillStyle = 'silver';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 6); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 5);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (7 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 8) {
                battlefield_ctx.fillStyle = 'darkslategrey';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 5); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 4);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (6 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 7) {
                battlefield_ctx.fillStyle = 'blue';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 4); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (5 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 6) {
                battlefield_ctx.fillStyle = 'royalblue';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (5 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 5) {
                battlefield_ctx.fillStyle = '#00ff00';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (5 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
        
            if (darkTankPosition[i].health === 4) {
                battlefield_ctx.fillStyle = '#00ff00';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 64, 3); // 64 = 16*4 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (5 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 3) {
                battlefield_ctx.fillStyle = 'yellow';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 48, 3); // 48 = 16*3 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (5 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 2) {
                battlefield_ctx.fillStyle = 'yellow';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 32, 3); // 32= 16*2 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (5 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }
            if (darkTankPosition[i].health === 1) {
                battlefield_ctx.fillStyle = 'red';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 16, 3); // 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
                if (darkTankPosition[i].boss) {
                    battlefield_ctx.drawImage(bossCrownImg, darkTankPosition[i].x + 33, darkTankPosition[i].y - (5 + bossCrownImg.height), bossCrownImg.width, bossCrownImg.height);
                }
            }

            i--;

        } while (i > -1);

    }

    // Tan Tank health bars
    if (tanTankPosition.length -1 > -1) {

        let i = tanTankPosition.length - 1;

        do {

            if (tanTankPosition[i].health === 12) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 9); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 8);
            }
            if (tanTankPosition[i].health === 11) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 8); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 7);
            }
            if (tanTankPosition[i].health === 10) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 7); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 6);
            }
            if (tanTankPosition[i].health === 9) {
                battlefield_ctx.fillStyle = 'silver';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 6); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 5);
            }
            if (tanTankPosition[i].health === 8) {
                battlefield_ctx.fillStyle = 'darkslategrey';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 5); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 4);
            }
            if (tanTankPosition[i].health === 7) {
                battlefield_ctx.fillStyle = 'blue';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 4); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3);
            }
            if (tanTankPosition[i].health === 6) {
                battlefield_ctx.fillStyle = 'royalblue';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3);
            }
            if (tanTankPosition[i].health === 5) {
                battlefield_ctx.fillStyle = '#00ff00';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3); // 80 is image width
                /// Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3);
            }
            if (tanTankPosition[i].health === 4) {
                battlefield_ctx.fillStyle = '#00ff00';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 64, 3); // 64 = 16*4 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3);
            }
            if (tanTankPosition[i].health === 3) {
                battlefield_ctx.fillStyle = 'yellow';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 48, 3); // 48 = 16*3 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3);
            }
            if (tanTankPosition[i].health === 2) {
                battlefield_ctx.fillStyle = 'yellow';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 32, 3); // 32= 16*2 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3);
            }
            if (tanTankPosition[i].health === 1) {
                battlefield_ctx.fillStyle = 'red';
                battlefield_ctx.fillRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 16, 3); // 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(tanTankPosition[i].x, tanTankPosition[i].y - 1, 80, 3);
            }

            i--;

        } while (i > -1);

    }
    

}

// Functions for AI Tanks

const tankAI = () => {

    // Ensure Tan Tank and AI Tanks exists
    if (tanTankPosition.length > 0 && darkTankPosition.length > 0) {

        let i = tanTankPosition.length - 1;
        let n = darkTankPosition.length - 1;

        do {

            // Ensure each tank(n) is compared with the same round(i) (see n-- in final else statement after do.. while.. loop)
            if (n < 0) {
            
                n = darkTankPosition.length - 1;
                i--;
            }

            // Ensure error doesn't occur by looping though when i = -1
            if (i < 0) {
              
                break;
            }
            // AI Move UP and LEFT towards player  
            if (tanTankPosition[i].x < darkTankPosition[n].x && tanTankPosition[i].y < darkTankPosition[n].y) {
               
                darkTankPosition[n].facingLeft = true;
                darkTankPosition[n].x -= 2;
                darkTankPosition[n].y -= 1;
            }
            // AI Move DOWN and LEFT towards player   
            if (tanTankPosition[i].x < darkTankPosition[n].x && tanTankPosition[i].y > darkTankPosition[n].y) {
                
                darkTankPosition[n].facingLeft = true;
                darkTankPosition[n].x -= 2;
                darkTankPosition[n].y += 1;
            }
            // AI Move DOWN and RIGHT towards player 
            if (tanTankPosition[i].x > darkTankPosition[n].x && tanTankPosition[i].y > darkTankPosition[n].y) {
                
                darkTankPosition[n].facingLeft = false;
                darkTankPosition[n].x += 2;
                darkTankPosition[n].y += 1;
            }
            // AI Move UP and RIGHT towards player 
            if (tanTankPosition[i].x > darkTankPosition[n].x && tanTankPosition[i].y < darkTankPosition[n].y) {
                
                darkTankPosition[n].facingLeft = false;
                darkTankPosition[n].x += 2;
                darkTankPosition[n].y -= 1;
            }
            // AI Move UP towards player
            if (tanTankPosition[i].x === darkTankPosition[n].x && tanTankPosition[i].y < darkTankPosition[n].y) {
                
                darkTankPosition[n].x += 0;
                darkTankPosition[n].y -= 1;
            }
            // AI Move DOWN towards player
            if (tanTankPosition[i].x === darkTankPosition[n].x && tanTankPosition[i].y > darkTankPosition[n].y) {
                
                darkTankPosition[n].facingLeft = false;
                darkTankPosition[n].x += 0;
                darkTankPosition[n].y += 1;
            }
            // AI fire round right towards player 
            if (tanTankPosition[i].y <= darkTankPosition[n].y + 40 && tanTankPosition[i].y >= darkTankPosition[n].y - 40 && darkTankPosition[n].facingLeft === false) {

                if (!darkTankPosition[n].boss) {
                    if (darkTankPosition[n].roundFiredIndex === 0 || darkTankPosition[n].roundFiredIndex === 2) {
                        roundFired = true;
                        //darkTankPosition[i].roundFiredIndex += 1;
                        tankRoundArr.push({x: darkTankPosition[n].x + 81, y: darkTankPosition[n].y + 17, velocity: 15, darkTankRound: true, roundLive: true, isBossRound: false});
                        battlefield_ctx.drawImage(muzzleFire, darkTankPosition[n].x + 81, darkTankPosition[n].y + 12, muzzleFire.width, muzzleFire.height);
                    }
                }
                else if (darkTankPosition[n].boss) {
                    if (darkTankPosition[n].roundFiredIndex === 0 || darkTankPosition[n].roundFiredIndex === 2) {
                        roundFired = true;
                        //darkTankPosition[i].roundFiredIndex += 1;
                        tankRoundArr.push({x: darkTankPosition[n].x + 81, y: darkTankPosition[n].y + 17, velocity: 16, darkTankRound: true, roundLive: true, isBossRound: true});
                        battlefield_ctx.drawImage(muzzleFire, darkTankPosition[n].x + 81, darkTankPosition[n].y + 12, muzzleFire.width + 2, muzzleFire.height + 2);
                    }
                }
                if (darkTankPosition[n].roundFiredIndex === 3) {
                    darkTankPosition[n].roundFiredIndex = 0;
                }
                darkTankPosition[n].roundFiredIndex += 1;
            
            }
            // AI fire round left towards player 
            if (tanTankPosition[i].y <= darkTankPosition[n].y + 40 && tanTankPosition[i].y >= darkTankPosition[n].y - 40 && darkTankPosition[n].facingLeft === true) {

                if (!darkTankPosition[n].boss) {
                    if (darkTankPosition[n].roundFiredIndex === 0 || darkTankPosition[n].roundFiredIndex === 2) {
                        roundFired = true;
                        //darkTankPosition[i].roundFiredIndex += 1;
                        tankRoundArr.push({x: darkTankPosition[n].x, y: darkTankPosition[n].y + 17, velocity: -15, darkTankRound: true, roundLive: true, isBossRound: false});
                        battlefield_ctx.drawImage(muzzleFire, darkTankPosition[n].x - 15, darkTankPosition[n].y + 12, muzzleFire.width, muzzleFire.height);
                    }
                }
                else if (darkTankPosition[n].boss) {
                    if (darkTankPosition[n].roundFiredIndex === 0 || darkTankPosition[n].roundFiredIndex === 2) {
                        roundFired = true;
                        //darkTankPosition[i].roundFiredIndex += 1;
                        tankRoundArr.push({x: darkTankPosition[n].x, y: darkTankPosition[n].y + 17, velocity: -16, darkTankRound: true, roundLive: true, isBossRound: true});
                        battlefield_ctx.drawImage(muzzleFire, darkTankPosition[n].x - 15, darkTankPosition[n].y + 12, muzzleFire.width + 2, muzzleFire.height + 2);
                    }
                }
                if (darkTankPosition[n].roundFiredIndex === 3) {
                    darkTankPosition[n].roundFiredIndex = 0;
                }
                darkTankPosition[n].roundFiredIndex += 1;

            }
            // Damage Player if AI and Player are in same position
            if (tanTankPosition[i].y === darkTankPosition[n].y && tanTankPosition[i].x === darkTankPosition[n].x) {
                tanTankPosition[i].health -= 1;
                // Remove Player from game if health === 0
                if (tanTankPosition[i].health === 0) {
                    if (tanTankPosition[0].facingLeft) {
                        battlefield_ctx.drawImage(firstExplosion, tanTankPosition[0].x, tanTankPosition[0].y, firstExplosion.width, firstExplosion.height);
                    }
                    if (!tanTankPosition[0].facingLeft) {
                        battlefield_ctx.drawImage(secondExplosion, tanTankPosition[0].x - 10, tanTankPosition[0].y, secondExplosion.width, secondExplosion.height);
                    }
                    tanTankPosition.splice(tanTankPosition[i], 1);
                }
                if (tanTankPosition.length === 0) {
                    
                    gameOverDisplay();
                    i = -1;
                }
            }
            
            n--;

        } while (i > -1);

    } else {
        return;
    }

}

// ** Dependent on height and width of battlefield
// Invoked in didRoundHit
const generateRandomAI = () => {

    let facingLeft;
    let randomNumber;
    let x;
    let y;
    let health;
    let boss;
    let roundFiredIndex = 0;

    if (startObj.battleRoyal) {

        randomNumber = Math.floor(Math.random() * 100);
        
        if (randomNumber >= 50) {
            facingLeft = false;
        }
        else if (randomNumber < 50) {
            facingLeft = true;
        }

        health = 5 + (Math.floor(Math.random() * 8));

        if (health === 12) {
            boss = true;
        }
        else if (health < 12) {
            boss = false;
        }

    //if (startObj.battleRoyal) {
        
        if (facingLeft) {
            // battilefield.width < x < battilefield.width + 300(probably start at battlefield.width + 100)
            x = battlefield.width + (100 + (Math.floor(Math.random() * 2) * 100));
            // battilefield.height > y > 0
            y = battlefield.height - (Math.floor(Math.random() * 8) * 100);
         
        }
        else if (!facingLeft) {
            //  x < 0 - 300(probably start at battlefield.width + 100)
            x = 0 - (100 + (Math.floor(Math.random() * 2) * 100));
            // 0 < y
            y = 0 + (Math.floor(Math.random() * 8) * 100);
        }
        
        if (darkTankPosition.length > 0) {

            let arr = [];
            arr.push({x: x, y: y, facingLeft: facingLeft, health: health, boss: boss, roundFiredIndex: roundFiredIndex});

            for (let i = darkTankPosition.length - 1; i >= 0; i--) {

                if (darkTankPosition[i] === arr[0]) {
                    arr.splice(0, 1);
                    generateRandomAI();
                    i = -1;
                    return;
                } 
                else if (darkTankPosition[i].x <= arr[0].x + 80 && darkTankPosition[i].x >= arr[0].x - 80 && darkTankPosition[i].y <= arr[0].y + 80 && darkTankPosition[i].y >= - 40) {
                    arr.splice(0, 1);
                    generateRandomAI();
                    i = -1;
                    return;
                }

            }

        } 

        darkTankPosition.push({x: x, y: y, facingLeft: facingLeft, health: health, boss: boss, roundFiredIndex: roundFiredIndex});

    } else {
        return;
    }
    
}

// Fire Munition
const fireRound = () => {
    
    
    // This loop works becasue fireRound() is repeatedly invoked in drawTanks()
    if (tankRoundArr.length - 1 >= 0) {
    
        let i = tankRoundArr.length - 1;
        
        do {
            // Set the color of the round
            battlefield_ctx.fillStyle = 'black';
            // Set the border color of the round
            battlefield_ctx.strokestyle = 'black';
            
            if (!tankRoundArr[i].isBossRound) {
                // Draw a "filled" rectangle to represent the round at the coordinates the round is located
                battlefield_ctx.fillRect(tankRoundArr[i].x, tankRoundArr[i].y, 4, 2);
                // Draw a border around the round
                battlefield_ctx.strokeRect(tankRoundArr[i].x, tankRoundArr[i].y, 4, 2);
            }
            else if (tankRoundArr[i].isBossRound) {
                // Draw a "filled" rectangle to represent the round at the coordinates the round is located
                battlefield_ctx.fillRect(tankRoundArr[i].x, tankRoundArr[i].y, 7, 2.5);
                // Draw a border around the round
                battlefield_ctx.strokeRect(tankRoundArr[i].x, tankRoundArr[i].y, 7, 2.5);
            }

            // Change round location according to round velocity
            tankRoundArr[i].x = tankRoundArr[i].x + tankRoundArr[i].velocity;
           
            i--;
            
        } while (i >= 0);
      } else {
        return;
      }

}

const didRoundHit = () => {
    
    // Compare location arrays only when darkTankPosition has objects 
        // Using darkTankPosition.length as benchmark ensures error doesn't occur if all tanks are cleared from battlefield
    if (darkTankPosition.length - 1 > -1) {
    
        let i = tankRoundArr.length - 1;
        let n = darkTankPosition.length - 1;
    
    
        //do {
        while (i >= 0) {
          
          // Ensure each tank(n) is compared with the same round(i) (see n-- in final else statement after /*do..*/ while.. loop)
          if (n < 0) {
            
            n = darkTankPosition.length - 1;
            i--;
           

          }

          // Ensure error doesn't occur by looping though when i = -1
          if (i < 0) {
         
            break;

          }
          
          // Does round leave board
          if (tankRoundArr[i].x > battlefield.width + 100 || tankRoundArr[i].x < -100) {
                
            // Stop round from moving
            tankRoundArr[i].velocity = 0;
            // Clear round from canvas
            tankRoundArr[i].x = battlefield.width + 20;
            //console.log(tankRoundArr.length);
            // Make round dead
            tankRoundArr[i].roundLive = false;

          }

          // Does round hit tank
          if (tankRoundArr[i].x >= darkTankPosition[n].x + 40 === true && tankRoundArr[i].x <= darkTankPosition[n].x + 55 === true && tankRoundArr[i].y <= darkTankPosition[n].y + 40 === true && tankRoundArr[i].y >= darkTankPosition[n].y === true && tankRoundArr[i].darkTankRound === false && tankRoundArr[i].roundLive === true) {
             
            // Draw imact explosion
            battlefield_ctx.drawImage(muzzleFire, tankRoundArr[i].x, tankRoundArr[i].y, muzzleFire.width - 8, muzzleFire.height - 8);
            // Lower tank health
            darkTankPosition[n].health = darkTankPosition[n].health - 1;
            // Check tank damage and remove from play if health is 0
            if (darkTankPosition[n].health === 0) {
               
                if (darkTankPosition[n].facingLeft) {
                    battlefield_ctx.drawImage(firstExplosion, darkTankPosition[n].x, darkTankPosition[n].y, firstExplosion.width, firstExplosion.height);
                }
                if (!darkTankPosition[n].facingLeft) {
                    battlefield_ctx.drawImage(secondExplosion, darkTankPosition[n].x - 12, darkTankPosition[n].y, secondExplosion.width, secondExplosion.height);
                }
               
                if (startObj.gameStart) {
                    // Needs to occur before splice
                    destroyedTanksArr.push(darkTankPosition[n]);
                }

                darkTankPosition.splice(n, 1);
                
                if (startObj.gameStart) {
                    // Needs to occur after splice
                    scoreboardDisplay();
                }
                //drawFire();
            }
          
            // Stop round from moving
            tankRoundArr[i].velocity = 0;
            // Clear round from canvas
            tankRoundArr[i].x = battlefield.width + 20;
            //console.log(tankRoundArr.length);
            // Make round dead
            tankRoundArr[i].roundLive = false;
            
            // Generate AI Tanks for 'Battle Royal' Gameplay Mode
            if (startObj.battleRoyal && startObj.gameStart) {
                if(darkTankPosition.length === 1) {
                    generateRandomAI();
                    generateRandomAI();
                    generateRandomAI();
                    generateRandomAI();
                }
            }
             
            if (darkTankPosition.length === 0) {
                 gameOverDisplay();
                 i = -1;
                 break;
            }
    
          }

          // Does round hit player 
            // Temporary fix if works - doesn't address array loop if ever want to add allies
          if (tanTankPosition.length > 0) {

            if (tankRoundArr[i].x >= tanTankPosition[0].x + 40 === true && tankRoundArr[i].x <= tanTankPosition[0].x + 55 === true && tankRoundArr[i].y <= tanTankPosition[0].y + 40 === true && tankRoundArr[i].y >= tanTankPosition[0].y === true && tankRoundArr[i].roundLive === true) {
                
                if (!tankRoundArr[i].isBossRound) {
                    // Draw imact explosion
                    battlefield_ctx.drawImage(muzzleFire, tankRoundArr[i].x, tankRoundArr[i].y, muzzleFire.width - 8, muzzleFire.height - 8);
                    // Lower tank health
                    tanTankPosition[0].health -= 1;
                }
                if (tankRoundArr[i].isBossRound) {
                    // Draw imact explosion
                    battlefield_ctx.drawImage(muzzleFire, tankRoundArr[i].x, tankRoundArr[i].y, muzzleFire.width - 4, muzzleFire.height - 4);
                    // Lower tank health
                    tanTankPosition[0].health -= 2;
                }
            
                // Check tank damage and remove from play if health is 0
                if (tanTankPosition[0].health <= 0) {
                    if (tanTankPosition[0].facingLeft) {
                        battlefield_ctx.drawImage(firstExplosion, tanTankPosition[0].x, tanTankPosition[0].y, firstExplosion.width, firstExplosion.height);
                    }
                    if (!tanTankPosition[0].facingLeft) {
                        battlefield_ctx.drawImage(secondExplosion, tanTankPosition[0].x - 10, tanTankPosition[0].y, secondExplosion.width, secondExplosion.height);
                    }
                    tanTankPosition.splice(0, 1);
                }
                if (tanTankPosition.length === 0) {
                    gameOverDisplay();
                    break;
                }
                // Remove round from play
                // Stop round from moving
                tankRoundArr[i].velocity = 0;
                // Clear round from canvas
                tankRoundArr[i].x = battlefield.width + 20;
                // Make round dead
                tankRoundArr[i].roundLive = false;
        
            }

          } else {

            // Ensure each tank(n) is compared with the same round(i) (^^see first if statement)
            n--;
             
          }    
          
          // Ensure error doesn't occur if round is spliced from last if statement
          if (tankRoundArr.length === 0) {
            i = -1;
            break;
          } 
        
          else {

              // Ensure each tank(n) is compared with the same round(i) (^^see first if statement)
              n--;
               
            } 
    
        }
    
      } 
   
    else {
        
        // Final do... while... loop ensures tankRoundArr is still cleared if no tanks are on the battlefield
          let i = tankRoundArr.length - 1;
          //do {
          while (i >= 0) {
            
            // Ensure i doesn't loop through as - 1
            if (i < 0) {
                //return;
                break;
            }
            // Does round leave board
            if (tankRoundArr[i].x > battlefield.width + 100 || tankRoundArr[i].x < -100) {
                
                // Stop round from moving
                tankRoundArr[i].velocity = 0;
                // Clear round from canvas
                tankRoundArr[i].x = battlefield.width + 20;
                // Make round dead
                tankRoundArr[i].roundLive = false;

            }

            i--;

        }
         
          return;
      }
    
    }



////////////
////////////


///////////////////////////////////////////////////


// ** Below should all eventually only be in controls.js **
//////////////////////////////////
///////////////////
// Global Variables

// Screen Touch
const startMenu = document.getElementById('start-menu');
const startMenuTouch = document.getElementById('start-menu-touch');
const startAndOverScreen = document.getElementById('start-and-over-screen');

// ** Need to create seperate touch and mouse options
const leftOptionMouse = document.getElementById('left-option-mouse');
const rightOptionMouse = document.getElementById('right-option-mouse');
const leftOptionTouch = document.getElementById('left-option-touch');
const rightOptionTouch = document.getElementById('right-option-touch');

// Lower Screen Display
const lowerScreenRight = document.getElementById('lower-screen-right');

// Mobile Game Pad Controls
const fireButton = document.getElementById('fire-button');
const upButton = document.getElementById('up-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const downButton = document.getElementById('down-button');

///////////////////

///////////////////

////////////
// Functions

// Start Menu

// startObj moved to top of file
//let startObj = {startClicked: false, animationPlayed: false, gameStart: false, gameOver: false, battleRoyal: false, onTouchLeft: false, onTouchUp: false, onTouchRight: false, onTouchDown: false, currentScore: 0, totalHighScoreDisplay: 25};

// only runs on desktop browsers (see media query)
  // ** Any Changes here must also be made in startMenuTouch.ontouchstart()
startMenu.onmousedown = () => {
    
    // Reset game to origional parameters and restart animation
    if (startObj.gameOver) {

        // Reset game to origional parameters
        tanksDestroyed.style.display = 'none';
        bossesDestroyed.style.display = 'none';
        currentScore.style.display = 'none';
        highScore.style.display = 'none';
        scoreboard.style.zIndex = '1';
        tanksDestroyed.style.backgroundColor = '';
        tanksDestroyed.style.color = '';
        bossesDestroyed.style.backgroundColor = '';
        bossesDestroyed.style.color = '';
        currentScore.style.backgroundColor = '';
        currentScore.style.color = '';
        highScore.style.backgroundColor = '';
        highScore.style.color = '';

        startAndOverScreen.innerHTML = '';
        startAndOverScreen.style.color = 'red';
        startObj.gameOver = false;
        startObj.animationPlayed = false;
        startObj.gameStart = false;
        roundFired = false;
        lowerScreenRight.style.color = 'rgb(82, 235, 82)';
        topTitleScreen.style.visibility = 'visible';
        bottomTitleScreen.style.visibility = 'visible';
        // Clear out any remaining objects in tank arrays
        tanTankPosition.splice(0, tanTankPosition.length);
        darkTankPosition.splice(0, darkTankPosition.length);
        // Clear out any remaining objects in round array
        tankRoundArr.splice(0, tankRoundArr.length);
        

        // Restart animation
        gameStartAnimation();
        // Have to invoke gameStartAnimation() before changing startObj.animationPlayed
        startObj.animationPlayed = true;
        startAndOverScreen.style.animation = 'fadeIn 2s ease-in';
        startAndOverScreen.style.opacity = '0';
        //lowerScreenRight.innerHTML = 'Click Screen to Pause';
        lowerScreenRight.style.visibility = 'hidden';
    
        //bottomTitleScreen.style.zIndex = '5';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';
        leftOptionMouse.style.visibility = 'visible';
        leftOptionTouch.style.visibility = 'visible';
        rightOptionMouse.style.visibility = 'visible';
        rightOptionTouch.style.visibility = 'visible';

        let sec = 1;
        
        const timer = setInterval(function(){

            if (sec === 0) {
                bottomTitleScreen.style.zIndex = '5';
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000);

    }
    
    else if (!startObj.animationPlayed) {

        gameStartAnimation();
        // Have to invoke gameStartAnimation() before changing startObj.animationPlayed
        startObj.animationPlayed = true;
        startAndOverScreen.style.animation = 'fadeIn 2s ease-in';
        startAndOverScreen.style.opacity = '0';
        //lowerScreenRight.innerHTML = 'Click Screen to Pause';
        lowerScreenRight.style.visibility = 'hidden';
        
        //bottomTitleScreen.style.zIndex = '5';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';

        let sec = 1;
        
        const timer = setInterval(function(){

            if (sec === 0) {
                bottomTitleScreen.style.zIndex = '5';
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000);
        

    }
    
    else if (!startObj.gameStart) {

        let sec = 6;

        const timer = setInterval(function(){

            if (sec === 6) {
                startMenu.style.visibility = 'hidden';
                startMenuTouch.style.visibility = 'hidden';
                bottomTitleText.innerHTML = 'Loading...';
                startAndOverScreen.style.backgroundColor = 'rgb(15, 15, 15)';
                startAndOverScreen.style.animation = 'fadeOut 2s ease-in';
                startAndOverScreen.style.opacity = '1';
            }
            else if (sec === 4) {

                topTitleScreen.style.visibility = 'hidden';
                bottomTitleScreen.style.visibility = 'hidden';
                bottomTitleText.innerHTML = 'Choose Gameplay Mode';

                leftOptionMouse.style.backgroundColor = '';
                leftOptionMouse.style.color = '';
                leftOptionMouse.style.border = '';
                leftOptionTouch.style.backgroundColor = '';
                leftOptionTouch.style.color = '';
                leftOptionTouch.style.border = '';
                leftOptionMouse.style.visibility = 'hidden';
                leftOptionTouch.style.visibility = 'hidden';

                rightOptionMouse.style.backgroundColor = '';
                rightOptionMouse.style.color = '';
                rightOptionMouse.style.border = '';
                rightOptionTouch.style.backgroundColor = '';
                rightOptionTouch.style.color = '';
                rightOptionTouch.style.border = '';
                rightOptionMouse.style.visibility = 'hidden';
                rightOptionTouch.style.visibility = 'hidden';

                returnOrigionalTanks();

                startAndOverScreen.style.animation = 'fadeIn 4s ease-in';
                startAndOverScreen.style.opacity = '0';
                startAndOverScreen.innerHTML = 'Ready';
                
                scoreboardDisplay();
                
            }
            else if (sec === 3) {
                startAndOverScreen.innerHTML = '3';
            }
            else if (sec === 2) {
                startAndOverScreen.innerHTML = '2';
            }
            else if (sec === 1) {
                startAndOverScreen.innerHTML = '1';
            }
            else if (sec === 0) {
                startAndOverScreen.innerHTML = '0';
                startMenu.style.visibility = 'visible';
                startMenuTouch.style.visibility = 'visible';
                clearInterval(timer);
                lowerScreenRight.innerHTML = 'Click Screen to Pause';
                lowerScreenRight.style.visibility = 'visible';
                // startObj.gameStart is dependent on opening animation and to some degree, scoreboardDisplay() via didRoundHit()
                startObj.gameStart = true;
                //scoreboardDisplay();
                drawTanks();
                //startAndOverScreen.style.backgroundColor = '';
                startAndOverScreen.innerHTML = '';
                return;
            }
            sec--;

        }, 1000);

    }

    else if (!startObj.startClicked) {

        startObj.startClicked = true;
        startMenu.style.opacity = '.7';
        lowerScreenRight.innerHTML = 'Paused: Click Screen to Resume';
        lowerScreenRight.style.color = 'rgb(82, 235, 82)';

    }

    else if (startObj.startClicked) {

        startObj.startClicked = false;
        startMenu.style.opacity = '';
        lowerScreenRight.innerHTML = 'Click Screen to Pause';
        lowerScreenRight.style.color = 'rgb(82, 235, 82)';

    }

}

// Only runs on mobile browsers (see media query)
  // ** Any Changes here must also be made in startMenu.onmousedown()
//startMenuTouch.ontouchstart = () => {
startMenuTouch.onpointerdown = () => {
    
    // Reset game to origional parameters and restart animation
    if (startObj.gameOver) {

         // Reset game to origional parameters
        tanksDestroyed.style.display = 'none';
        bossesDestroyed.style.display = 'none';
        currentScore.style.display = 'none';
        highScore.style.display = 'none';
        scoreboard.style.zIndex = '1';
        tanksDestroyed.style.backgroundColor = '';
        tanksDestroyed.style.color = '';
        bossesDestroyed.style.backgroundColor = '';
        bossesDestroyed.style.color = '';
        currentScore.style.backgroundColor = '';
        currentScore.style.color = '';
        highScore.style.backgroundColor = '';
        highScore.style.color = '';

        startAndOverScreen.innerHTML = '';
        startAndOverScreen.style.color = 'red';
        startObj.gameOver = false;
        startObj.animationPlayed = false;
        startObj.gameStart = false;
        roundFired = false;
        lowerScreenRight.style.color = 'rgb(82, 235, 82)';
        topTitleScreen.style.visibility = 'visible';
        bottomTitleScreen.style.visibility = 'visible';
        // Clear out any remaining objects in tank arrays
        tanTankPosition.splice(0, tanTankPosition.length);
        darkTankPosition.splice(0, darkTankPosition.length);
        // Clear out any remaining objects in round array
        tankRoundArr.splice(0, tankRoundArr.length);

        // Restart animation
        gameStartAnimation();
        // Have to invoke gameStartAnimation() before changing startObj.animationPlayed
        startObj.animationPlayed = true;
        startAndOverScreen.style.animation = 'fadeIn 2s ease-in';
        startAndOverScreen.style.opacity = '0';
        //lowerScreenRight.innerHTML = 'Click Screen to Pause';
        lowerScreenRight.style.visibility = 'hidden';

        //bottomTitleScreen.style.zIndex = '5';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';
        leftOptionMouse.style.visibility = 'visible';
        leftOptionTouch.style.visibility = 'visible';
        rightOptionMouse.style.visibility = 'visible';
        rightOptionTouch.style.visibility = 'visible';

        let sec = 1;
        
        const timer = setInterval(function(){

            if (sec === 0) {
                bottomTitleScreen.style.zIndex = '5';
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000);

    }
    
    else if (!startObj.animationPlayed) {

        gameStartAnimation();
        // Have to invoke gameStartAnimation() before changing startObj.animationPlayed
        startObj.animationPlayed = true;
        startAndOverScreen.style.animation = 'fadeIn 2s ease-in';
        startAndOverScreen.style.opacity = '0';
        //lowerScreenRight.innerHTML = 'Click Screen to Pause';
        lowerScreenRight.style.visibility = 'hidden';
        
        //bottomTitleScreen.style.zIndex = '5';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';

        let sec = 1;
        
        const timer = setInterval(function(){

            if (sec === 0) {
                bottomTitleScreen.style.zIndex = '5';
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000);

    }
    
    else if (!startObj.gameStart) {

        let sec = 6;

        const timer = setInterval(function(){

            if (sec === 6) {
                startMenu.style.visibility = 'hidden';
                startMenuTouch.style.visibility = 'hidden';
                bottomTitleText.innerHTML = 'Loading...';
                startAndOverScreen.style.backgroundColor = 'rgb(15, 15, 15)';
                startAndOverScreen.style.animation = 'fadeOut 2s ease-in';
                startAndOverScreen.style.opacity = '1';
            }
            else if (sec === 4) {
                
                topTitleScreen.style.visibility = 'hidden';
                bottomTitleScreen.style.visibility = 'hidden';
                bottomTitleText.innerHTML = 'Choose Gameplay Mode';

                leftOptionMouse.style.backgroundColor = '';
                leftOptionMouse.style.color = '';
                leftOptionMouse.style.border = '';
                leftOptionTouch.style.backgroundColor = '';
                leftOptionTouch.style.color = '';
                leftOptionTouch.style.border = '';
                leftOptionMouse.style.visibility = 'hidden';
                leftOptionTouch.style.visibility = 'hidden';

                rightOptionMouse.style.backgroundColor = '';
                rightOptionMouse.style.color = '';
                rightOptionMouse.style.border = '';
                rightOptionTouch.style.backgroundColor = '';
                rightOptionTouch.style.color = '';
                rightOptionTouch.style.border = '';
                rightOptionMouse.style.visibility = 'hidden';
                rightOptionTouch.style.visibility = 'hidden';

                returnOrigionalTanks();

                startAndOverScreen.style.animation = 'fadeIn 4s ease-in';
                startAndOverScreen.style.opacity = '0';
                startAndOverScreen.innerHTML = 'Ready';
                
                scoreboardDisplay();
                
            }
            else if (sec === 3) {
                startAndOverScreen.innerHTML = '3';
            }
            else if (sec === 2) {
                startAndOverScreen.innerHTML = '2';
            }
            else if (sec === 1) {
                startAndOverScreen.innerHTML = '1';
            }
            else if (sec === 0) {
                startAndOverScreen.innerHTML = '0';
                clearInterval(timer);
                startMenu.style.visibility = 'visible';
                startMenuTouch.style.visibility = 'visible';
                lowerScreenRight.innerHTML = 'Click Screen to Pause';
                lowerScreenRight.style.visibility = 'visible';
                // startObj.gameStart is dependent on opening animation
                startObj.gameStart = true;
                drawTanks();
                startAndOverScreen.innerHTML = '';
                return;
            }
            sec--;

        }, 1000)

    }

    else if (!startObj.startClicked) {

        startObj.startClicked = true;
        startMenu.style.opacity = '.7';
        lowerScreenRight.innerHTML = 'Paused: Click Screen to Resume';
        lowerScreenRight.style.color = 'rgb(82, 235, 82)';

    }

    else if (startObj.startClicked) {

        startObj.startClicked = false;
        startMenu.style.opacity = '';
        lowerScreenRight.innerHTML = 'Click Screen to Pause';
        lowerScreenRight.style.color = /*'rgb(17, 228, 243)'*/'rgb(82, 235, 82)';

    }
}

// Gameplay Options

leftOptionMouse.onmousedown = () => {

    startObj.battleRoyal = false;
    leftOptionMouse.style.backgroundColor = 'rgb(15, 15, 15)';
    leftOptionMouse.style.color = 'rgb(82, 235, 82)';
    leftOptionMouse.style.border = '1px solid white';
    rightOptionMouse.style.visibility = 'hidden';
    rightOptionTouch.style.visibility = 'hidden';
    bottomTitleText.innerHTML = 'Click Screen to Play';

    bottomTitleScreen.style.zIndex = '';
    startMenu.style.visibility = 'visible';
    startMenuTouch.style.visibility = 'visible';

    bottomAnimationImg.src = './TanTankLeft.png';

}
//leftOptionTouch.ontouchstart = () => {
leftOptionTouch.onpointerdown = () => {

    startObj.battleRoyal = false;
    leftOptionTouch.style.backgroundColor = 'rgb(15, 15, 15)';
    leftOptionTouch.style.color = 'rgb(82, 235, 82)';
    leftOptionTouch.style.border = '1px solid white';
    rightOptionMouse.style.visibility = 'hidden';
    rightOptionTouch.style.visibility = 'hidden';
    bottomTitleText.innerHTML = 'Click Screen to Play';

    bottomTitleScreen.style.zIndex = '';
    startMenu.style.visibility = 'visible';
    startMenuTouch.style.visibility = 'visible';

    bottomAnimationImg.src = './TanTankLeft.png';

}
rightOptionMouse.onmousedown = () => {

    startObj.battleRoyal = true;
    rightOptionMouse.style.backgroundColor = 'rgb(15, 15, 15)';
    rightOptionMouse.style.color = 'rgb(82, 235, 82)';
    rightOptionMouse.style.border = '1px solid white';
    leftOptionMouse.style.visibility = 'hidden';
    leftOptionTouch.style.visibility = 'hidden';
    bottomTitleText.innerHTML = 'Click Screen to Play';

    bottomTitleScreen.style.zIndex = '';
    startMenu.style.visibility = 'visible';
    startMenuTouch.style.visibility = 'visible';

    bottomAnimationImg.src = './TanTankRight.png';

}
//rightOptionTouch.ontouchstart = () => {
rightOptionTouch.onpointerdown = () => {

    startObj.battleRoyal = true;
    rightOptionTouch.style.backgroundColor = 'rgb(15, 15, 15)';
    rightOptionTouch.style.color = 'rgb(82, 235, 82)';
    rightOptionTouch.style.border = '1px solid white';
    leftOptionMouse.style.visibility = 'hidden';
    leftOptionTouch.style.visibility = 'hidden';
    bottomTitleText.innerHTML = 'Click Screen to Play';

    bottomTitleScreen.style.zIndex = '';
    startMenu.style.visibility = 'visible';
    startMenuTouch.style.visibility = 'visible';

    bottomAnimationImg.src = './TanTankRight.png';

}



// Gamepad

// Fire Button
//fireButton.ontouchstart = () => {
fireButton.onpointerdown = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        if (tanTankPosition[0].facingLeft === true) {
            tankRoundArr.push({
                x: tanTankPosition[0].x, 
                y: tanTankPosition[0].y + 17, 
                velocity: -15, 
                darkTankRound: false, 
                roundLive: true, 
                isBossRound: false
            });
            battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x - 15, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
            roundFired = true;

        } 
        else if (tanTankPosition[0].facingLeft === false) {
            tankRoundArr.push({x: tanTankPosition[0].x + 81, y: tanTankPosition[0].y + 17, velocity: 15, darkTankRound: false, roundLive: true, isBossRound: false});
            battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x + 78, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
            roundFired = true;
        }
    fireButton.style.backgroundColor = 'lightcoral';
    fireButton.style.color = 'lightgrey';
    fireButton.style.boxShadow = 'none';
    } else {
        return;
    }
}
//fireButton.ontouchend = () => {
fireButton.onpointerup = () => {
    fireButton.style.backgroundColor = '';
    fireButton.style.color = '';
    fireButton.style.boxShadow = '';
}

// Direction Pad
// LEFT
//leftButton.ontouchstart = () => {
leftButton.onpointerdown = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        startObj.onTouchLeft = true;
        //tanTankPosition[0].x -= 10;
        tanTankPosition[0].facingLeft = true;
        leftButton.style.boxShadow = 'none';
        leftButton.style.backgroundColor = 'rgb(80, 80, 80)';
        //leftButtonHold();
    } else {
        return;
    }
}
const leftButtonHold = () => {
    if (tanTankPosition.length > 0) {
        if (startObj.onTouchLeft) {
            tanTankPosition[0].x -= 10;
        } else if (!startObj.onTouchLeft) {
            return;
        }
    } else {
        return;
    }
}
//leftButton.ontouchend = () => {
leftButton.onpointerup = () => {
    leftButton.style.boxShadow = '';
    leftButton.style.backgroundColor = '';
    startObj.onTouchLeft = false;
}
// UP
//upButton.ontouchstart = () => {
upButton.onpointerdown = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        startObj.onTouchUp = true;
        //tanTankPosition[0].y -= 10;
        upButton.style.boxShadow = 'none';
        upButton.style.backgroundColor = 'rgb(80, 80, 80)';
        //upButtonHold();
    } else {
        return;
    }
}
const upButtonHold = () => {
    if (tanTankPosition.length > 0) {
        if (startObj.onTouchUp) {
            tanTankPosition[0].y -= 10;
        } else if (!startObj.onTouchUp) {
            return;
        }
    } else {
        return
    }
}
//upButton.ontouchend = () => {
upButton.onpointerup = () => {
    upButton.style.boxShadow = '';
    upButton.style.backgroundColor = '';
    startObj.onTouchUp = false;
}
// RIGHT
//rightButton.ontouchstart = () => {
rightButton.onpointerdown = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        startObj.onTouchRight = true;
        //tanTankPosition[0].x += 10;
        tanTankPosition[0].facingLeft = false;
        rightButton.style.boxShadow = 'none';
        rightButton.style.backgroundColor = 'rgb(80, 80, 80)';
        //rightButtonHold();
    } else {
        return;
    }
}
const rightButtonHold = () => {
    if (tanTankPosition.length > 0) {
        if (startObj.onTouchRight) {
            tanTankPosition[0].x += 10;
        } else if (!startObj.onTouchRight) {
            return;
        }
    } else {
        return;
    }   
}
//rightButton.ontouchend = () => {
rightButton.onpointerup = () => {
    rightButton.style.boxShadow = '';
    rightButton.style.backgroundColor = '';
    startObj.onTouchRight = false;
}
// DOWN
//downButton.ontouchstart = () => {
downButton.onpointerdown = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        startObj.onTouchDown = true;
        //tanTankPosition[0].y += 10;
        downButton.style.boxShadow = 'none';
        downButton.style.backgroundColor = 'rgb(80, 80, 80)';
        //downButtonHold();
    } else {
        return;
    }
}
const downButtonHold = () => {
    if (tanTankPosition.length > 0) {
        if (startObj.onTouchDown) {
            tanTankPosition[0].y += 10;
        } else if (!startObj.onTouchDown) {
            return;
        }
    } else {
        return;
    }
}
//downButton.ontouchend = () => {
downButton.onpointerup = () => {
    downButton.style.boxShadow = '';
    downButton.style.backgroundColor = '';
    startObj.onTouchDown = false;
}

// Keyboard Controls

const upButtonKeyboard = document.getElementById('up-button-keyboard');
const leftButtonKeyboard = document.getElementById('left-button-keyboard');
const downButtonKeyboard = document.getElementById('down-button-keyboard');
const rightButtonKeyboard = document.getElementById('right-button-keyboard');
const fireButtonKeyboard = document.getElementById('fire-button-keyboard');

document.addEventListener("keydown", playerContols);
document.addEventListener("keydown", preventScroll);
document.addEventListener("keyup", playerContolsDisplay);

function playerContols(event) {
  
    const spacebar = 32;
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;
  
    const keyPressed = event.keyCode;
    
    // Ensure Controls are only usable during gameplay
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {

        if (keyPressed === spacebar) {
            if (tanTankPosition.length > 0) {
                if (tanTankPosition[0].facingLeft === true) {
                    tankRoundArr.push({x: tanTankPosition[0].x, y: tanTankPosition[0].y + 17, velocity: -15, darkTankRound: false, roundLive: true, isBossRound: false});
                    battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x - 15, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
                    roundFired = true;
                    fireButtonKeyboard.style.backgroundColor = 'lightcoral';
                    fireButtonKeyboard.style.color = 'lightgrey';
                    fireButtonKeyboard.style.boxShadow = 'none';
                    //fireButtonKeyboard.style.outlineOffset = '5px 5px 5px';
                    //console.log(tanTankPosition);
                    //console.log(tankRoundArr);
                } 
                else if (tanTankPosition[0].facingLeft === false) {
                    tankRoundArr.push({x: tanTankPosition[0].x + 81, y: tanTankPosition[0].y + 17, velocity: 15, darkTankRound: false, roundLive: true, isBossRound: false});
                    battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x + 78, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
                    roundFired = true;
                    fireButtonKeyboard.style.backgroundColor = 'lightcoral';
                    fireButtonKeyboard.style.color = 'lightgrey';
                    fireButtonKeyboard.style.boxShadow = 'none';
                    //fireButtonKeyboard.style.outlineOffset = '5px 5px 5px';
                    //console.log(tanTankPosition);
                    //console.log(tankRoundArr);
                }
            }
        }
        if (keyPressed === leftKey) {
            if (tanTankPosition.length > 0) {
                startObj.onTouchLeft = true;
                //tanTankPosition[0].x = tanTankPosition[0].x - 10;
                tanTankPosition[0].facingLeft = true;
                leftButtonKeyboard.style.boxShadow = 'none';
                leftButtonKeyboard.style.backgroundColor = 'rgb(80, 80, 80)';
            } else {
                return;
            }
        }
        if (keyPressed === upKey) {
            if (tanTankPosition.length > 0) {
                startObj.onTouchUp = true;
                //tanTankPosition[0].y = tanTankPosition[0].y - 10;
                upButtonKeyboard.style.boxShadow = 'none';
                upButtonKeyboard.style.backgroundColor = 'rgb(80, 80, 80)';
            } else {
                return;
            }
        }
        if (keyPressed === rightKey) {
            if (tanTankPosition.length > 0) {
                startObj.onTouchRight = true;
                //tanTankPosition[0].x = tanTankPosition[0].x + 10;
                tanTankPosition[0].facingLeft = false;
                rightButtonKeyboard.style.boxShadow = 'none';
                rightButtonKeyboard.style.backgroundColor = 'rgb(80, 80, 80)';
            } else {
                return;
            }
        }
        if (keyPressed === downKey) {
            if (tanTankPosition.length > 0) {
                startObj.onTouchDown = true;
                //tanTankPosition[0].y = tanTankPosition[0].y + 10;
                downButtonKeyboard.style.boxShadow = 'none';
                downButtonKeyboard.style.backgroundColor = 'rgb(80, 80, 80)';
            } else {
                return;
            }
        }

    } else {
        return;
    }
    
  }

function playerContolsDisplay(event) {
  
    const spacebar = 32;
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;
  
    const keyPressed = event.keyCode;

        if (keyPressed === spacebar) {
            fireButtonKeyboard.style.backgroundColor = '';
            fireButtonKeyboard.style.color = '';
            fireButtonKeyboard.style.boxShadow = ''; 
        }
        if (keyPressed === leftKey) {
            leftButtonKeyboard.style.boxShadow = '';
            leftButtonKeyboard.style.backgroundColor = '';
            startObj.onTouchLeft = false;
        }
        if (keyPressed === upKey) {
            upButtonKeyboard.style.boxShadow = '';
            upButtonKeyboard.style.backgroundColor = '';
            startObj.onTouchUp = false;
        }
        if (keyPressed === downKey) {
            downButtonKeyboard.style.boxShadow = '';
            downButtonKeyboard.style.backgroundColor = '';
            startObj.onTouchDown= false;
        }
        if (keyPressed === rightKey) {
            rightButtonKeyboard.style.boxShadow = '';
            rightButtonKeyboard.style.backgroundColor = '';
            startObj.onTouchRight = false;
        }
}

function preventScroll(event) {

    const spacebar = 32;
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;
  
    const keyPressed = event.keyCode; 

    if (keyPressed === leftKey || keyPressed === rightKey || keyPressed === upKey || keyPressed === downKey || keyPressed === spacebar) {

        event.preventDefault();

    }

}

//////////////////////////////////


//////////////////////////////////

//////////////////////////////////
// Display

// Scoreboard
// Global Varaibles
const scoreboard = document.getElementById('scoreboard-wrapper');
const tanksDestroyed = document.getElementById('tanks-destroyed');
const bossesDestroyed = document.getElementById('bosses-destroyed');
const currentScore = document.getElementById('current-score');
const highScore = document.getElementById('high-score');

// [{boss: true/false}] and destroyedTanksArr.length = score
let destroyedTanksArr = [];
//let destroyedBossesArr = [];

// Invoked in didRoundHit() when tank is destroyed and in startMenu.onmouse and startMenuTouch.ontouch for styling
  // This is might be too many concerns for one function
const scoreboardDisplay = () => {

    if (startObj.battleRoyal) {

        //let tanksScoreDisplay = destroyedTanksArr.length;
        bossesScoreDisplay = function(){

            let bossNumber = 0; 

            if (destroyedTanksArr.length > 0) {
                for (let i = 0; i < destroyedTanksArr.length; i++) {
                    if (destroyedTanksArr[i].boss) {
                        bossNumber++;
                    }
                    if (i === destroyedTanksArr.length - 1) {
                        return bossNumber;
                    }
                }
            } else {
                    return bossNumber;
                }
        }
        let tanksScoreDisplay = destroyedTanksArr.length - bossesScoreDisplay();
        highScoreDisplay = function(){
            
            let bossNumber = bossesScoreDisplay() * 10;
            let tankNumber = destroyedTanksArr.length - bossesScoreDisplay();
            startObj.currentScore = tankNumber + bossNumber;

            if (startObj.currentScore > startObj.totalHighScoreDisplay) {
                startObj.totalHighScoreDisplay = startObj.currentScore;
                return startObj.totalHighScoreDisplay;
            }
            else if (startObj.currentScore < startObj.totalHighScoreDisplay || startObj.currentScore === startObj.totalHighScoreDisplay) {
                return startObj.totalHighScoreDisplay;
            }
            
        }

        
        tanksDestroyed.innerHTML = `Tanks: ${tanksScoreDisplay}`;
        bossesDestroyed.style.borderRadius = '0';
        bossesDestroyed.innerHTML = `Bosses: ${bossesScoreDisplay()}`;
        tanksDestroyed.style.display = 'flex';
        bossesDestroyed.style.display = 'flex';
        highScore.style.display = 'flex';
        // highScoreDisplay() needs to be invoked inorder for startObj.totalHighScoreDisplay to be updated
        highScoreDisplay();
        if (startObj.currentScore >= startObj.totalHighScoreDisplay) {
            currentScore.style.display = 'none';
            highScore.innerHTML = `NEW HIGH-SCORE: ${highScoreDisplay()}`;
        }
        else if (startObj.currentScore < startObj.totalHighScoreDisplay) {
            currentScore.style.display = 'flex';
            highScore.innerHTML = `High-Score: ${highScoreDisplay()}`;
            // in order to be accurate, currentScore needs to be displayed after highScoreDisplay() is invoked
            currentScore.innerHTML = `Score: ${startObj.currentScore}`;
        }
        

    }

    if (!startObj.battleRoyal) {

        bossesScoreDisplay = function(){

            let bossNumber = 0;

            if (darkTankPosition.length > 0) {
                for (let i = 0; i < darkTankPosition.length; i++) {
                    if (darkTankPosition[i].boss) {
                        bossNumber++;
                    }
                    if (i === darkTankPosition.length - 1) {
                        return bossNumber;
                    }
                }
            } else {
                return bossNumber;
            }

        }
        let tanksScoreDisplay = darkTankPosition.length - bossesScoreDisplay();

        tanksDestroyed.innerHTML = `Tanks Remaining: ${tanksScoreDisplay}`;
        bossesDestroyed.style.borderRadius = '0 0 10px 0';
        bossesDestroyed.innerHTML = `Bosses Remaining: ${bossesScoreDisplay()}`;
        bossesDestroyed.style.display = 'flex';
        tanksDestroyed.style.display = 'flex';
        highScore.style.display = 'none';

    } else {
        return;
    }

}

// Game Over

// Invoked in didRoundHit()
const gameOverDisplay = () => {

    if (tanTankPosition.length === 0 && !startObj.battleRoyal) {
        startObj.gameOver = true;
        startAndOverScreen.style.animation = 'fadeOut 4s ease-in';
        startAndOverScreen.style.opacity = '1';
        startAndOverScreen.innerHTML = 'GAME OVER';
        lowerScreenRight.style.visibility = 'hidden';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';

        let sec = 4;

        const timer = setInterval(function(){

            if (sec === 1) {
                startMenuTouch.style.visibility = 'visible';
                startMenu.style.visibility = 'visible';
                lowerScreenRight.style.color = 'red';
                lowerScreenRight.style.visibility = 'visible';
                lowerScreenRight.innerHTML = 'Click Screen to Reset Game';

                scoreboard.style.zIndex = '3';
                tanksDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                tanksDestroyed.style.color = 'white';
                bossesDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                bossesDestroyed.style.color = 'white';

            }
            else if (sec === 0) {
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000)
    }
    else if (tanTankPosition.length === 0 && startObj.battleRoyal && startObj.currentScore < startObj.totalHighScoreDisplay) {
        startObj.gameOver = true;
        startAndOverScreen.style.animation = 'fadeOut 4s ease-in';
        startAndOverScreen.style.opacity = '1';
        startAndOverScreen.innerHTML = 'GAME OVER';
        lowerScreenRight.style.visibility = 'hidden';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';

        let sec = 4;

        const timer = setInterval(function(){

            if (sec === 1) {
                startMenuTouch.style.visibility = 'visible';
                startMenu.style.visibility = 'visible';
                lowerScreenRight.style.color = 'red';
                lowerScreenRight.style.visibility = 'visible';
                lowerScreenRight.innerHTML = 'Click Screen to Reset Game';
                
                scoreboard.style.zIndex = '3';
                tanksDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                tanksDestroyed.style.color = 'white';
                bossesDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                bossesDestroyed.style.color = 'white';
                currentScore.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                currentScore.style.color = 'white';
                highScore.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                highScore.style.color = 'white';
                // Ensure last second kill didn't create high score
                if (startObj.currentScore >= startObj.totalHighScoreDisplay){
                    startAndOverScreen.style.color = 'rgb(82, 235, 82)'
                    startAndOverScreen.innerHTML = `NEW HIGH SCORE: ${startObj.totalHighScoreDisplay}`;
                    highScore.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                    highScore.style.color = 'rgb(82, 235, 82)';
                    lowerScreenRight.style.color = 'rgb(82, 235, 82)';
                }
                startObj.currentScore = 0;

            }
            else if (sec === 0) {
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000)
    }
    else if (tanTankPosition.length === 0 && startObj.battleRoyal && startObj.currentScore >= startObj.totalHighScoreDisplay) {
        startObj.gameOver = true;
        startAndOverScreen.style.animation = 'fadeOut 4s ease-in';
        startAndOverScreen.style.opacity = '1';
        startAndOverScreen.style.color = 'rgb(82, 235, 82)'
        startAndOverScreen.innerHTML = `NEW HIGH SCORE: ${startObj.totalHighScoreDisplay}`;
        lowerScreenRight.style.visibility = 'hidden';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';

        let sec = 4;

        const timer = setInterval(function(){

            if (sec === 1) {
                startMenuTouch.style.visibility = 'visible';
                startMenu.style.visibility = 'visible';
                lowerScreenRight.style.color = 'rgb(82, 235, 82)';
                lowerScreenRight.style.visibility = 'visible';
                lowerScreenRight.innerHTML = 'Click Screen to Reset Game';
                
                
                scoreboard.style.zIndex = '3';
                tanksDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                tanksDestroyed.style.color = 'white';
                bossesDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                bossesDestroyed.style.color = 'white';
                currentScore.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                currentScore.style.color = 'white';
                highScore.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                highScore.style.color = 'rgb(82, 235, 82)';
                // Ensure any late kills are still counted
                startAndOverScreen.innerHTML = `NEW HIGH SCORE: ${startObj.totalHighScoreDisplay}`;
                startObj.currentScore = 0;
                

            }
            else if (sec === 0) {
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000)
    }
    else if (darkTankPosition.length === 0) {
        startObj.gameOver = true;
        startAndOverScreen.style.color = 'rgb(82, 235, 82)'
        startAndOverScreen.style.animation = 'fadeOut 4s ease-in';
        startAndOverScreen.style.opacity = '1';
        startAndOverScreen.innerHTML = 'YOU WIN';
        lowerScreenRight.style.visibility = 'hidden';
        startMenu.style.visibility = 'hidden';
        startMenuTouch.style.visibility = 'hidden';

        let sec = 4;

        const timer = setInterval(function(){

            if (sec === 1) {
                startMenuTouch.style.visibility = 'visible';
                startMenu.style.visibility = 'visible';
                lowerScreenRight.style.color = 'rgb(82, 235, 82)';
                lowerScreenRight.style.visibility = 'visible';
                lowerScreenRight.innerHTML = 'Click Screen to Reset Game';

                scoreboard.style.zIndex = '3';
                tanksDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                tanksDestroyed.style.color = 'rgb(82, 235, 82)';
                bossesDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                bossesDestroyed.style.color = 'rgb(82, 235, 82)';
            }
            else if (sec === 0) {
                clearInterval(timer);
                return;
            }
            sec--;

        }, 1000)
    }

}


//////////////////////////////////

// ****** Should be moved to animation.js */ */
///////////////////////////////////////////////////
// Animation

// Global Animation Variables
const topTitleScreen = document.getElementById('top-title-screen');
const bottomTitleScreen = document.getElementById('bottom-title-screen');
const bottomTitleText = document.getElementById('bottom-title-text');

const bottomAnimationImg = document.getElementById('bottom-animation-image'); 

// Animation Functions
const gameStartAnimation = () => {

        tanTankPosition = [
            {x: -80, y: 475, facingLeft: false, health: 5}
        ];
        darkTankPosition = [
            {x: battlefield.width, y: 475, facingLeft: true, health: 3},
            {x: -80, y: 475, facingLeft: false, health: 3},
            // Ensure error doesn't occur in animation when both darkTanks are removed from darkTankPosition
            {'place holder': 1}
        ];
        
        const timer = setInterval(function(){

            // Ensure loop stops running after player clicks screen to start game
            if (startObj.gameStart) {
                clearInterval(timer);
                return;
            }
            battlefield_ctx.fillStyle = battlefieldBackground;
            //  Select the colour for the border of the canvas
            battlefield_ctx.strokestyle = battlefieldBorder;
            // Draw a "filled" rectangle to cover the entire canvas
            battlefield_ctx.fillRect(0, 0, battlefield.width, battlefield.height);
            // Draw a "border" around the entire canvas
            battlefield_ctx.strokeRect(0, 0, battlefield.width, battlefield.height);

            drawEachTanTank();
            drawEachDarkTank();
            tanTankAnimationAI();
            darkTankAnimationAI();

            if (roundFired === true) {
                fireRound();
                didRoundHit();
            }
            if (roundFired === false) {
                return;
            }
            if (tanTankPosition[0].x >= battlefield.width + 10) {
                clearInterval(timer);
                // Restart animation
                gameStartAnimation();
                return;
            }      

        }, 80)

}

const tanTankAnimationAI = () => {

    if (darkTankPosition.length > 1) {
    
        if (tanTankPosition[0].x < (battlefield.width / 2) - 40) {

            tanTankPosition[0].x += 12;

        }

        else if (darkTankPosition[0].x === battlefield.width - 80 || darkTankPosition[0].x === battlefield.width - 90 || darkTankPosition[0].x === battlefield.width - 100) {

            tankRoundArr.push({x: tanTankPosition[0].x + 81, y: tanTankPosition[0].y + 17, velocity: 15, darkTankRound: false, roundLive: true, isBossRound: false});
            battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x + 78, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
            roundFired = true;

        }
        // After first dark tank is removed from darkTankPosition
        else if (darkTankPosition[0].facingLeft === false) {
            if (darkTankPosition[0].x === -40) {

                tanTankPosition[0].facingLeft = true;

            }
            if (darkTankPosition[0].x === 10 || darkTankPosition[0].x === 20 || darkTankPosition[0].x === 30) {

                //tanTankPosition[0].facingLeft = true;
                tankRoundArr.push({x: tanTankPosition[0].x, y: tanTankPosition[0].y + 17, velocity: - 15, darkTankRound: false, roundLive: true, isBossRound: false});
                battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x - 15, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
                //roundFired = true;

            }
        }
    } else {
        tanTankPosition[0].facingLeft = false;
        if (tanTankPosition[0].x <= battlefield.width + 10) {
            tanTankPosition[0].x += 12;
        } else {
            return;
        }
    }

}

const darkTankAnimationAI = () => {

    if (tanTankPosition[0].x >= (battlefield.width / 2) - 190) {

        if (darkTankPosition.length === 3) {
            
            darkTankPosition[0].x -= 5;

        }
        if (darkTankPosition.length === 2) {

            darkTankPosition[0].x += 5;
            return;

        }
        else {
            return;
        }

    } else {
        return;
    }

}
   
///////////////////////////////////////////////////




