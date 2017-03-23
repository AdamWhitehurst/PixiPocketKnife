var width;
var height;
var grid;
(function () {
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        var bounds = document.getElementById('canvas-hook').getBoundingClientRect();
        this.width = bounds.width;
        this.height = bounds.height;
        var restartBtn = document.getElementById('initialize-btn');
        restartBtn.addEventListener('click', onInitializeClick.bind (this), false);
    }
})();
function onInitializeClick() {
    this.grid = initGrid(width, height);
    console.log("Done.");
}