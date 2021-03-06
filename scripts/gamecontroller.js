import {PlayerController} from './playerController.js';
import {HackerText} from './hackerText.js';
import {AudioManager} from './AudioManager.js';

export class GameController {

    constructor() {
        this.margin = 1;
        this.gameW = 69;
        this.hackerW = 45;
        this.height = 40;
        this.width = this.gameW + this.margin * 4 + this.hackerW;
        this.gamePaneCoords = [this.margin, this.margin, this.gameW + this.margin, this.height - this.margin];
        this.hackerPaneCoords = [this.gamePaneCoords[2] + 2, this.margin, this.width - this.margin, this.height - this.margin];
        this.gamePane = new PlayerController(this.gameW, this.height - this.margin);
        this.hackerPane = new HackerText(this.hackerW, this.height - this.margin);
        this.gameOver = false;
        this.gameStart = true;
        const userAgentCheck = navigator.userAgent.match('Avast');
        if (userAgentCheck) {
            this.gameOverText = "Thankfully, you were because you were using\n Avast Secure Browser"
        } else {
            this.gameOverText = "You could have been saved by Avast Secure Browser.\nIt provide features to stop malware, phishing scams,\n and identity theft. Download it now!\nhttps://www.avast.com/en-gb/secure-browser"
        }
        let highscore = window.localStorage.getItem('highscore');
        if (!highscore) {
            window.localStorage.setItem('highscore', '10');
            highscore = '10'
        }
        this.highscoreText = `System High Score: ${highscore}`;

        this.oldScore = this.gamePane.score;
        this.audioMan = new AudioManager();


    }


    reset() {
        this.gamePane = new PlayerController(this.gameW, this.height - this.margin);
        this.hackerPane = new HackerText(this.hackerW, this.height - this.margin);


        this.oldScore = this.gamePane.score;

        this.start();
    }

    start() {
        this.gamePane.start();
        this.hackerPane.Start();

        document.addEventListener('keydown', (e) => {
            if (this.gameOver) {
                console.log(e.keyCode)
                if (e.keyCode === 8) {
                  console.log()
                    $('#highscore').text(this.highscoreText);
                    $("#startmenu").show();
                    $("#enemies").show();
                    this.gameStart = true;
                } else if (e.keyCode === 32) {
                  this.reset();
                  this.gameOverToggle();
                  return;
                }
        
            }
            if (this.gameStart) {
                $("#startmenu").hide();
                $("#enemies").hide();
                this.gameStart = false;
            }
        });
        $('#highscore').text(this.highscoreText);
        $('#gameover').hide();
    }

    async update(deltaTime) {
        if(!this.gameOver && !this.gameStart){
            this.gamePane.update(deltaTime);
        }

        if(this.gamePane.score==0 && !this.gameStart){
            this.hackerPane.showScore(this.gamePane.score);
        }

        console.log(this.gamePane.score);
        if (this.gamePane.score !== this.oldScore) {
            this.oldScore = this.gamePane.score;
            this.hackerPane.Update(deltaTime, this.gamePane.score);
        }

        if (this.gamePane.isGameOver && !this.gameOver) {
            this.gameOverToggle();
            this.updateHighScore();
            this.audioMan.playSound('gameEnds');

        }
    }

    updateHighScore() {
      let highscore = window.localStorage.getItem('highscore');
      if (this.gamePane.score > parseInt(highscore, 10)) {
        this.highscoreText = `Current High Score: ${this.gamePane.score}`
        window.localStorage.setItem('highscore', this.gamePane.score.toString());
      }
    }

    gameOverToggle() {
        if (!this.gameOver) {
            $('#gameover').show();
            $('#gameovertext').text(this.gameOverText);
        } else {
            $('#gameover').hide();
        }
        this.gameOver = !this.gameOver;
    }

    getText() {
        let gameText = this.gamePane.getText();
        let hackerText = this.hackerPane.getText();
        let outputString = "";
        for (let y = 0; y < this.height; y++) {
            let rowString = "";
            for (let x = 0; x < this.width; x++) {
                if (x >= this.gamePaneCoords[0] && x < this.gamePaneCoords[2]) {
                    if (y >= this.gamePaneCoords[1] && y < this.gamePaneCoords[3]) {
                        rowString += (gameText[y - this.margin][x - 1] || " ");
                        continue;
                    }
                }

                if (x >= this.hackerPaneCoords[0] && x < this.hackerPaneCoords[2]) {
                    if (y >= this.hackerPaneCoords[1] && y < this.hackerPaneCoords[3]) {
                        rowString += hackerText[y - this.margin][x - this.gamePaneCoords[2] - 2];
                        continue;
                    }
                }
                rowString += ' '
            }
            rowString += '\n';
            outputString += rowString
        }
        return outputString;
    }
}

export default GameController;