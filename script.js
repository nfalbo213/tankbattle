///////////////////////////////////////////////////

///////////////////
// Global Variables

// Tank Variables

let firstExplosion;
let secondExplosion;
let firstFire;
let secondFire;
let muzzleFire;

let fireLocation = [];

firstExplosion = new Image(95, 55);
firstExplosion.src = './Explosion.png';
secondExplosion = new Image(95, 55);
secondExplosion.src = './ExplosionReverse.png';

muzzleFire = new Image(25, 15);
muzzleFire.src = './ExplosionReverse.png';

firstFire = new Image(70, 30);
firstFire.src = './Fire.png';
secondFire = new Image(70, 30);
secondFire.src = './FireReverse.png';

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
            {x: -520, y: 200, facingLeft: false, health: 5}
        ];
        darkTankPosition = [
            // First Wave
            {x: 500, y: 220, facingLeft: true, health: 5, boss: false}, 
            {x: 600, y: 160, facingLeft: true, health: 5, boss: false}, 
            {x: 600, y: 280, facingLeft: true, health: 5, boss: false},
            // Second Wave
            {x: 800, y: 190, facingLeft: true, health: 6, boss: false}, 
            {x: 900, y: 0, facingLeft: true, health: 6, boss: false}, 
            {x: 900, y: 500, facingLeft: true, health: 6, boss: false},
            // Third Wave
            {x: 1100, y: 220, facingLeft: true, health: 6, boss: false}, 
            {x: 1200, y: -200, facingLeft: true, health: 6, boss: false}, 
            {x: 1200, y: 600, facingLeft: true, health: 6, boss: false},
            {x: 1300, y: -400, facingLeft: true, health: 6, boss: false}, 
            {x: 1300, y: 900, facingLeft: true, health: 6, boss: false},
            // Fourth Wave
            {x: 1400, y: 220, facingLeft: true, health: 7, boss: false}, 
            {x: 1500, y: -400, facingLeft: true, health: 7, boss: false}, 
            {x: 1500, y: 800, facingLeft: true, health: 7, boss: false},
            {x: 1500, y: -600, facingLeft: true, health: 7, boss: false}, 
            {x: 1500, y: 1100, facingLeft: true, health: 7, boss: false},
            // Boss
            {x: 2300, y: 220, facingLeft: true, health: 12, boss: true},
            //{x: 2300, y: 2220, facingLeft: true, health: 12, boss: true},
            //{x: 2300, y: -1780, facingLeft: true, health: 12, boss: true}
            
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
            tanTankImg.src = "./tanTankLeft.png"
        }
        if (tanTankPosition[0].facingLeft === false) {
            tanTankImg.src = "./tanTankRight.png"
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
            }
            if (darkTankPosition[i].health === 11) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 8); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 7);
            }
            if (darkTankPosition[i].health === 10) {
                battlefield_ctx.fillStyle = 'black';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 7); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 6);
            }
            if (darkTankPosition[i].health === 9) {
                battlefield_ctx.fillStyle = 'silver';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 6); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 5);
            }
            if (darkTankPosition[i].health === 8) {
                battlefield_ctx.fillStyle = 'darkslategrey';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 5); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 4);
            }
            if (darkTankPosition[i].health === 7) {
                battlefield_ctx.fillStyle = 'blue';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 4); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
            }
            if (darkTankPosition[i].health === 6) {
                battlefield_ctx.fillStyle = 'royalblue';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
            }
            if (darkTankPosition[i].health === 5) {
                battlefield_ctx.fillStyle = '#00ff00';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3); // 80 is image width
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
            }
            if (darkTankPosition[i].health === 4) {
                battlefield_ctx.fillStyle = '#00ff00';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 64, 3); // 64 = 16*4 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
            }
            if (darkTankPosition[i].health === 3) {
                battlefield_ctx.fillStyle = 'yellow';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 48, 3); // 48 = 16*3 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
            }
            if (darkTankPosition[i].health === 2) {
                battlefield_ctx.fillStyle = 'yellow';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 32, 3); // 32= 16*2 <-> 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
            }
            if (darkTankPosition[i].health === 1) {
                battlefield_ctx.fillStyle = 'red';
                battlefield_ctx.fillRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 16, 3); // 16 = 80/5 (80 is image width)
                // Draw a border around healthbar
                battlefield_ctx.strokestyle = 'black';
                battlefield_ctx.strokeRect(darkTankPosition[i].x, darkTankPosition[i].y - 1, 80, 3);
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

                roundFired = true;
                tankRoundArr.push({x: darkTankPosition[n].x + 81, y: darkTankPosition[n].y + 17, velocity: 15, darkTankRound: true, roundLive: true});
                battlefield_ctx.drawImage(muzzleFire, darkTankPosition[n].x + 81, darkTankPosition[n].y + 12, muzzleFire.width, muzzleFire.height);

            }
            // AI fire round left towards player 
            if (tanTankPosition[i].y <= darkTankPosition[n].y + 40 && tanTankPosition[i].y >= darkTankPosition[n].y - 40 && darkTankPosition[n].facingLeft === true) {

                roundFired = true;
                tankRoundArr.push({x: darkTankPosition[n].x, y: darkTankPosition[n].y + 17, velocity: -15, darkTankRound: true, roundLive: true});
                battlefield_ctx.drawImage(muzzleFire, darkTankPosition[n].x - 15, darkTankPosition[n].y + 12, muzzleFire.width, muzzleFire.height);

            }
            // Damage Player if AI and Player are in same position
            if (tanTankPosition[i].y === darkTankPosition[n].y && tanTankPosition[i].x === darkTankPosition[n].x) {
                tanTankPosition[i].health -= 1;
                // Remove Player from game if health === 0
                if (tanTankPosition[i].health === 0) {
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

        darkTankPosition.push({x: x, y: y, facingLeft: facingLeft, health: health, boss: boss});

    } else {
        return;
    }
    
}


// Keyboard Controls

document.addEventListener("keydown", playerContols);

function playerContols(event) {
  
    const SPACEBAR = 32;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
  
    const keyPressed = event.keyCode;
    
    // Ensure Controls are only usable during gameplay
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {

        if (keyPressed === SPACEBAR) {
            if (tanTankPosition.length > 0) {
                if (tanTankPosition[0].facingLeft === true) {
                    tankRoundArr.push({x: tanTankPosition[0].x, y: tanTankPosition[0].y + 17, velocity: -15, darkTankRound: false, roundLive: true});
                    battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x - 15, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
                    roundFired = true;
                    
                } 
                else if (tanTankPosition[0].facingLeft === false) {
                    tankRoundArr.push({x: tanTankPosition[0].x + 81, y: tanTankPosition[0].y + 17, velocity: 15, darkTankRound: false, roundLive: true});
                    battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x + 78, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
                    roundFired = true;
                   
                }
            }
        }
        if (keyPressed === LEFT_KEY) {
            if (tanTankPosition.length > 0) {
                tanTankPosition[0].x = tanTankPosition[0].x - 10;
                tanTankPosition[0].facingLeft = true;
               
            } else {
                return;
            }
        }
        if (keyPressed === UP_KEY) {
            if (tanTankPosition.length > 0) {
                tanTankPosition[0].y = tanTankPosition[0].y - 10;
            } else {
                return;
            }
        }
        if (keyPressed === RIGHT_KEY) {
            if (tanTankPosition.length > 0) {
                tanTankPosition[0].x = tanTankPosition[0].x + 10;
                tanTankPosition[0].facingLeft = false;
            } else {
                return;
            }
        }
        if (keyPressed === DOWN_KEY) {
            if (tanTankPosition.length > 0) {
                tanTankPosition[0].y = tanTankPosition[0].y + 10;
            } else {
                return;
            }
        }

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
            battlefield_ctx.fillStyle = 'black';
            // Set the border colour of the round
            battlefield_ctx.strokestyle = 'black';
            // Draw a "filled" rectangle to represent the round at the coordinates the round is located
            battlefield_ctx.fillRect(tankRoundArr[i].x, tankRoundArr[i].y, 4, 2);
            // Draw a border around the round
            battlefield_ctx.strokeRect(tankRoundArr[i].x, tankRoundArr[i].y, 4, 2);

           
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

            if (darkTankPosition.length === 0) {
                if (startObj.battleRoyal) {
                    generateRandomAI();
                    generateRandomAI();
                    generateRandomAI();
                    generateRandomAI();
                    generateRandomAI();
                }
                else if (!startObj.battleRoyal) {
                    gameOverDisplay();
                    i = -1;
                    break;
                }
            }
    
          }

          // Does round hit player 
            // Temporary fix if works - doesn't address array loop if ever want to add allies
          if (tanTankPosition.length > 0) {

            if (tankRoundArr[i].x >= tanTankPosition[0].x + 40 === true && tankRoundArr[i].x <= tanTankPosition[0].x + 55 === true && tankRoundArr[i].y <= tanTankPosition[0].y + 40 === true && tankRoundArr[i].y >= tanTankPosition[0].y === true && tankRoundArr[i].roundLive === true) {
                
                // Draw imact explosion
                battlefield_ctx.drawImage(muzzleFire, tankRoundArr[i].x, tankRoundArr[i].y, muzzleFire.width - 8, muzzleFire.height - 8);
                // Lower tank health
                tanTankPosition[0].health = tanTankPosition[0].health - 1;
                // Check tank damage and remove from play if health is 0
                if (tanTankPosition[0].health === 0) {
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
// startClicked implicatded in drawTanks(), startMenu.onmousedown()
let startObj = {startClicked: false, animationPlayed: false, gameStart: false, gameOver: false, battleRoyal: false};
//let gameStart = false;
//let gameOver = false;

// only runs on desktop browsers (see media query)
  // ** Any Changes here must also be made in startMenuTouch.ontouchstart()
startMenu.onmousedown = () => {
    
    // Reset game to origional parameters and restart animation
    if (startObj.gameOver) {

        // Reset game to origional parameters
        tanksDestroyed.style.display = 'none';
        bossesDestroyed.style.display = 'none';
        highScore.style.display = 'none';
        scoreboard.style.zIndex = '';
        tanksDestroyed.style.backgroundColor = '';
        tanksDestroyed.style.color = '';
        bossesDestroyed.style.backgroundColor = '';
        bossesDestroyed.style.color = '';
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
                scoreboardDisplay();
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
startMenuTouch.ontouchstart = () => {
    
    // Reset game to origional parameters and restart animation
    if (startObj.gameOver) {

        // Reset game to origional parameters
        tanksDestroyed.style.display = 'none';
        bossesDestroyed.style.display = 'none';
        highScore.style.display = 'none';
        scoreboard.style.zIndex = '';
        tanksDestroyed.style.backgroundColor = '';
        tanksDestroyed.style.color = '';
        bossesDestroyed.style.backgroundColor = '';
        bossesDestroyed.style.color = '';
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
leftOptionTouch.ontouchstart = () => {

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
rightOptionTouch.ontouchstart = () => {

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
fireButton.ontouchstart = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        if (tanTankPosition[0].facingLeft === true) {
            tankRoundArr.push({x: tanTankPosition[0].x, y: tanTankPosition[0].y + 17, velocity: -15, darkTankRound: false, roundLive: true});
            battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x - 15, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
            roundFired = true;

        } 
        else if (tanTankPosition[0].facingLeft === false) {
            tankRoundArr.push({x: tanTankPosition[0].x + 81, y: tanTankPosition[0].y + 17, velocity: 15, darkTankRound: false, roundLive: true});
            battlefield_ctx.drawImage(muzzleFire, tanTankPosition[0].x + 78, tanTankPosition[0].y + 12, muzzleFire.width, muzzleFire.height);
            roundFired = true;
        }
    fireButton.style.backgroundColor = 'lightcoral';
    fireButton.style.color = 'lightgrey';
    fireButton.style.boxShadow = 'none';
    fireButton.style.outlineOffset = '5px 5px 5px';
    } else {
        return;
    }
}
fireButton.ontouchend = () => {
    fireButton.style.backgroundColor = '';
    fireButton.style.color = '';
    fireButton.style.boxShadow = '';
}

// Direction Pad
// LEFT
leftButton.ontouchstart = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {  
        tanTankPosition[0].x -= 10;
        tanTankPosition[0].facingLeft = true;
        leftButton.style.boxShadow = 'none';
        leftButton.style.backgroundColor = 'rgb(80, 80, 80)';
    } else {
        return;
    }
}
leftButton.ontouchend = () => {
    leftButton.style.boxShadow = '';
    leftButton.style.backgroundColor = '';
}
// UP
upButton.ontouchstart = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        tanTankPosition[0].y -= 10;
        upButton.style.boxShadow = 'none';
        upButton.style.backgroundColor = 'rgb(80, 80, 80)';
    } else {
        return;
    }
}
upButton.ontouchend = () => {
    upButton.style.boxShadow = '';
    upButton.style.backgroundColor = '';
}
// RIGHT
rightButton.ontouchstart = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        tanTankPosition[0].x += 10;
        tanTankPosition[0].facingLeft = false;
        rightButton.style.boxShadow = 'none';
        rightButton.style.backgroundColor = 'rgb(80, 80, 80)';
    } else {
        return;
    }
}
rightButton.ontouchend = () => {
    rightButton.style.boxShadow = '';
    rightButton.style.backgroundColor = '';
}
// DOWN
downButton.ontouchstart = () => {
    if (startObj.gameStart && !startObj.startClicked && !startObj.gameOver) {
        tanTankPosition[0].y += 10;
        tanTankPosition[0].facingLeft = false;
        downButton.style.boxShadow = 'none';
        downButton.style.backgroundColor = 'rgb(80, 80, 80)';
    } else {
        return;
    }
}
downButton.ontouchend = () => {
    downButton.style.boxShadow = '';
    downButton.style.backgroundColor = '';
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
const highScore = document.getElementById('high-score');


let totalHighScoreDisplay = 25; /*= {highScore: ''};*/

// [{boss: true/false}] and destroyedTanksArr.length = score
let destroyedTanksArr = [];
//let destroyedBossesArr = [];

// Invoked in didRoundHit() when tank is destroyed and in startMenu.onmouse and startMenuTouch.ontouch for styling
  // This is might be too many concerns for one function
const scoreboardDisplay = () => {

    if (startObj.battleRoyal) {

        let tanksScoreDisplay = destroyedTanksArr.length;
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
        highScoreDisplay = function(){
            
            let bossNumber = bossesScoreDisplay() * 10;
            let tankNumber = destroyedTanksArr.length;
            let score = tankNumber + bossNumber;

            if (score >= totalHighScoreDisplay) {
                totalHighScoreDisplay = score;
                return totalHighScoreDisplay;
            }
            else if (score < totalHighScoreDisplay) {
                return totalHighScoreDisplay;
            }
            
        }

        
        tanksDestroyed.innerHTML = `Tanks: ${tanksScoreDisplay}`
        bossesDestroyed.style.borderRadius = '0';
        bossesDestroyed.innerHTML = `Bosses: ${bossesScoreDisplay()}`
        highScore.innerHTML = `High-Score: ${highScoreDisplay()}`
        tanksDestroyed.style.display = 'flex';
        bossesDestroyed.style.display = 'flex';
        highScore.style.display = 'flex';
        

    }

    if (!startObj.battleRoyal) {

        let tanksScoreDisplay = darkTankPosition.length;
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

        tanksDestroyed.innerHTML = `Tanks Remaining: ${tanksScoreDisplay}`
        bossesDestroyed.style.borderRadius = '0 0 10px 0';
        bossesDestroyed.innerHTML = `Bosses Remaining: ${bossesScoreDisplay()}`
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

    if (tanTankPosition.length === 0) {
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
                
                if (startObj.battleRoyal) {
                    scoreboard.style.zIndex = '3';
                    tanksDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                    tanksDestroyed.style.color = 'white';
                    bossesDestroyed.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                    bossesDestroyed.style.color = 'white';
                    highScore.style.backgroundColor = 'rgba(144, 238, 144, 0)';
                    highScore.style.color = 'white';
                }

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

    // This if statement may be redundent
    //if (!startObj.animationPlayed) {

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

            tankRoundArr.push({x: tanTankPosition[0].x + 81, y: tanTankPosition[0].y + 17, velocity: 15, darkTankRound: false, roundLive: true});
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
                tankRoundArr.push({x: tanTankPosition[0].x, y: tanTankPosition[0].y + 17, velocity: - 15, darkTankRound: false, roundLive: true});
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




