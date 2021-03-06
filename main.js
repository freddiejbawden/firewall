import {GameController} from './scripts/gamecontroller.js'
import {AudioManager} from './scripts/AudioManager.js'

const gc = new GameController(150, 45);
let time;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then((reg) => {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch((error) => {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
$(document).ready(function () {
    gc.start();
    console.log('hello!');
    $('#gamescreen').text(gc.getText());
    time = Date.now();
    const am = new AudioManager();
    am.playSound('gameStart')
});

setInterval(() => {
    gc.update(Date.now() - time);
    time = Date.now();
    $('#gamescreen').text(gc.getText());
}, 1000 / 60);