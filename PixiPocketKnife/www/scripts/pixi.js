
(function () {
    this.height;
    this.width;
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        var bounds = document.getElementById('canvas-hook').getBoundingClientRect();
        this.width = bounds.width;
        this.height = bounds.height;
        var initBtn = document.getElementById('left-btn');
        initBtn.addEventListener('click', onLeftBtnClick.bind(this), false);

        var rsrtBtn = document.getElementById('center-btn');
        rsrtBtn.addEventListener('click', onCenterBtnClick.bind(this), false);

        var stepBtn = document.getElementById('right-btn');
        stepBtn.addEventListener('click', onRightBtnClick.bind(this), false);
    }
})();

function onLeftBtnClick() {
    
};
function onCenterBtnClick() {
    
};

function onRightBtnClick() {
    
};