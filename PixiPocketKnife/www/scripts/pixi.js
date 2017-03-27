var width;
var height;
var grid;
var aStarInitted;
var stepResponse = 0;
(function () {
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        var bounds = document.getElementById('canvas-hook').getBoundingClientRect();
        this.width = bounds.width;
        this.height = bounds.height;
        var initBtn = document.getElementById('initialize-btn');
        initBtn.addEventListener('click', runToEnd.bind(this), false);

        var rsrtBtn = document.getElementById('restart-btn');
        rsrtBtn.addEventListener('click', onRestartClick.bind(this), false);

        var stepBtn = document.getElementById('step-btn');
        stepBtn.addEventListener('click', onStepClick.bind(this), false);
    }
})();
function onInitializeClick() {
    console.log("Initialize a grid!");
    this.grid = initGrid(width, height);
};
function onRestartClick() {
    this.grid = initGrid(width, height);
    console.log("Begin A* Pathfinder!");
    stepResponse = 0;
    initAStar(grid.array[0][0], grid.array[COLUMNS - 1][ROWS - 1]);
    this.aStarInitted = true;
};

function onStepClick() {
    if (!this.aStarInitted) {
        onRestartClick();
    }
    console.log("Step.");
    stepResponse = stepAStar();
};

function runToEnd() {
    while (stepResponse == 0) {
        onStepClick();
    }
}