var width;
var height;
var gridInitted;
var aStarInitted;
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
    if (!this.grid) {
        onInitializeClick();
    }
    console.log("Begin A* Pathfinder!");
    initAStar(grid.array[0][0], grid.array[COLUMNS - 1][ROWS - 1]);
    aStarInitted = true;
};

function onStepClick() {
    if (!this.aStarInitted) {
        onRestartClick();
    }
    console.log("Step.");
    stepAStar();
};

function runToEnd() {
    while (!aStarDone) {
        onStepClick();
    }
}