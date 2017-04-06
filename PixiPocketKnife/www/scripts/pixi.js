var creatureWorld;
var stage;
var play;
var pixiRenderer;

(function () {
    document.addEventListener('deviceready', function() {
        // Hook up button event listeners
        var redBtn = document.getElementById('red-btn');
        redBtn.addEventListener('click', onRedBtnClick.bind(this), false);
        var orangeBtn = document.getElementById('orange-btn');
        orangeBtn.addEventListener('click', onOrangeBtnClick.bind(this), false);
        var yellowBtn = document.getElementById('yellow-btn');
        yellowBtn.addEventListener('click', onYellowBtnClick.bind(this), false);
        var greenBtn = document.getElementById('green-btn');
        greenBtn.addEventListener('click', onGreenBtnClick.bind(this), false);
        var blueBtn = document.getElementById('blue-btn');
        blueBtn.addEventListener('click', onBlueBtnClick.bind(this), false);
        var violetBtn = document.getElementById('violet-btn');
        violetBtn.addEventListener('click', onVioletBtnClick.bind(this), false);

        // Load pixi texture assets
        loadAssets();

    }.bind(this), false);
})();

function loadAssets() {
    // Load assets
    PIXI.loader.add([
        "/res/icons/android/icon-36-ldpi.png",
        "/res/icons/android/icon-48-mdpi.png",
        "/res/icons/android/icon-96-xhdpi.png"
    ]).load(function () {
        postLoadAssets();
    });
}
function postLoadAssets() {
    // Capture renderer and initialize a stage
    var container = $('#canvas-container');
    pixiRenderer = PIXI.autoDetectRenderer(container.width(), container.height(), { transparent: true });

    //Add the canvas to the HTML document
    container.append(pixiRenderer.view);

    //Create a container object called the `stage`
    stage = new PIXI.Container();

    creatureWorld = new World(pixiRenderer, stage, 10);
    creatureWorld.populate();
    play = creatureWorld.loop();

    pixiGameLoop();
}

function pixiGameLoop() {
    //Loop this function 60 times per second
    requestAnimationFrame(pixiGameLoop);

    //Update the current game state:
    play();

    //Render the stage
    pixiRenderer.render(stage);
}

function pause () {
    // TODO: Not stuff
}

function onRedBtnClick() {
    play = pause();
}
function onOrangeBtnClick() {
    
}

function onYellowBtnClick() {

}

function onGreenBtnClick() {
    play = creatureWorld.loop();
}

function onBlueBtnClick() {

}

function onVioletBtnClick() {

}