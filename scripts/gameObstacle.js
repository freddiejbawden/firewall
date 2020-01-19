export class gameObsctacle {
    constructor(gameWidth, gameHeight, enemyList) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;


        //four obstacle types:
        //generic : moves straight down
        //trojan : moves straight down but looks non-malicious for most of the way
        //non-malicious : user packets (if blocked lose score because inconvenient)
        //spy-ware : follows player movement
        this.enemyType = Math.floor(Math.random() * 4);

        this.shapes = [
            [["\\", "~", "/"], ["/", "A", "\\"], ["|", " ", "|"], ["_", "^", "_"]],
            [["\\", "~", "/"], ["/", "B", "\\"], ["|", " ", "|"], ["_", "^", "_"]],
            this.stringTo2DCharArr(" / \\\n" +
                " ( )\n" +
                " (   )\n" +
                " /|/ \\|\\\n" +
                " /_|| ||_\\"),
            [["\\", "~", "/"], ["/", "D", "\\"], ["|", " ", "|"], ["_", "^", "_"]]
        ];

        this.shape = this.shapes[this.enemyType];
        // this.shape = [["\\", "~", "/"], ["/", "Ö", "\\"], ["|", " ", "|"], ["_", "^", "_"]],[["\\", "~", "/"], ["/", "Ö", "\\"], ["|", " ", "|"], ["_", "^", "_"]];


        this.enemyList = enemyList;

        this.stepLength = 9;
        let temp = this.getRandomInt(1, this.stepLength - 1);
        this.x = temp * this.stepLength;

        let foundY = false;

        while(!foundY){
            this.y = this.getRandomInt(-20, 0);
            foundY = true;
            for (let i = 0; i < this.enemyList.length; i++) {
                //this.x === this.enemyList[i].x ||
                if((Math.abs(this.enemyList[i].y - this.y) <= Math.ceil((this.enemyList[i].shape.length + this.shape.length) / 2))) {
                    foundY = false;
                }
            }
        }

        this.totalTime = 0;
        this.moveTime = 5000;
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