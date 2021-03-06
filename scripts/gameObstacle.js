export class gameObsctacle {
    constructor(gameWidth, gameHeight, enemyList) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;


        //four obstacle types:
        //0 generic : moves straight down
        //1 trojan : moves straight down but looks non-malicious for most of the way
        //2 non-malicious : user packets (if blocked lose score because inconvenient)
        //3 spy-ware : follows player movement

        let distribution = [0,0,0,0,1,2,3]
        this.enemyType = distribution[Math.floor(Math.random()*distribution.length)];

        this.shapes = [
            [["\\", "~", "/"], ["/", "Ö", "\\"], ["|", " ", "|"]],
            [["\\", "~", "/"], ["/", "æ", "\\"], ["|", " ", "|"]],
            this.stringTo2DCharArr(
                ".--.\n" +
                "| -- \\\n" +
                "| -- |\n" +
                "'----'"),
            [["\\", " ", "/"], [" ", "X", " "], ["/", " ", "\\"]]
        ];

        this.shape = this.shapes[this.enemyType];
        // this.shape = [["\\", "~", "/"], ["/", "Ö", "\\"], ["|", " ", "|"], ["_", "^", "_"]],[["\\", "~", "/"], ["/", "Ö", "\\"], ["|", " ", "|"], ["_", "^", "_"]];


        this.enemyList = enemyList;

        this.stepLength = 9;

        let foundPosition = false;

        while(!foundPosition){
            this.x = this.getRandomInt(1, this.stepLength - 1) * this.stepLength;
            this.y = Math.floor(this.getRandomInt(-20, 0));
            foundPosition = true;
            for (let i = 0; i < this.enemyList.length; i++) {
                //this.x === this.enemyList[i].x ||
                if((this.enemyList[i].x === this.x && Math.abs(this.enemyList[i].y - this.y) <= 7)) {
                    console.log("diff: "+ this.enemyList[i].y);
                    foundPosition = false;
                }
            }
        }

        this.totalTime = 0;
        this.moveTime = 4000;
    }


    stringToCharArr(string) {
        return Array.from(string);
    }

    //!!!!!!! check cuz might not work
    stringTo2DCharArr(x) {
        return (x.split(/\r?\n/)).map(this.stringToCharArr);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    start() {

    }

    update(deltaTime, playerX) {
        //all enemies move straight down
        if(this.enemyType < 5){
            this.y = Math.floor(this.totalTime * this.gameHeight / this.moveTime);
            this.totalTime += deltaTime;
        }
        //spy-ware movement
        if(this.enemyType === 3){
            if(this.y < this.gameHeight * 0.4){
                this.x = playerX;
            } else {
                if(this.y === this.gameHeight * 0.4){
                    if(playerX + this.stepLength < this.gameWidth){
                        this.x = playerX + this.stepLength;
                    } else {
                        this.x = playerX - this.stepLength;
                    }
                }
            }
        }
        //trojan shape-shifting
        if(this.enemyType === 1){
            if(this.y < this.gameHeight * 0.3 || this.y > 0.4 * this.gameHeight){
                this.shape = this.shapes[2];
            } else {
                this.shape = this.shapes[0];
            }
        }
    }

}