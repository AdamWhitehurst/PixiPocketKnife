//Constants
var COLUMNS = 10;
var ROWS = 18;
//Grid Variables
var nodeWidth = 0;
var nodeHeight = 0;
var stage;
var renderer;
var grid;
//Pixi Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

(function autoExec() {
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    function onDeviceReady() {
        init();
    }

    function init() {
        grid = new Array(COLUMNS);
        for (var i = 0; i < COLUMNS; i++) {
            grid[i] = new Array(ROWS);
        };

        //Find where to hook Pixi's canvas to
        var canvasHook = document.getElementById('canvas-hook');
        var bounds = canvasHook.getBoundingClientRect();

        //Create the renderer
        this.renderer = PIXI.autoDetectRenderer(bounds.width, bounds.height, { transparent: true });

        //Add the canvas to the HTML document
        canvasHook.appendChild(renderer.view);

        //Create a container object called the `stage`
        this.stage = new PIXI.Container();

        //Tell the `renderer` to `render` the `stage`
        renderer.render(stage);

        //Load the grid sprite texture
        PIXI.loader.add([
            "/res/icons/android/icon-36-ldpi.png",
            "/res/icons/android/icon-48-mdpi.png",
            "/res/icons/android/icon-96-xhdpi.png",
            ])
            .on("progress", function (loader, resource) {
                console.log("loading: '" + resource.url + "' progress: " + loader.progress + "%");
            })
            .load(function () {
                console.log("Done loading resource!");
            });
    }
})();
//Grid Node Stuff
var GridState = {
    START: 0xAA3939,
    END: 0x2D882D,
    BLOCKED: 0x003333,
    VISITED: 0x226666,
    CHECKED: 0xAA6C39
}

class GridNode {
    constructor(i, j, width, height) {
        this.gridPosI = i;
        this.gridPosJ = j;
        this.worldPosX = width * i;
        this.worldPosY = height * j;
        this.gScore = 0;
        this.fScore = 0;
        this.hScore = 0;
        this.sprite = new PIXI.Sprite(resources["/res/icons/android/icon-96-xhdpi.png"].texture);
        this.sprite.x = this.worldPosX;
        this.sprite.y = this.worldPosY;
        this.sprite.width = width;
        this.sprite.height = height;
    }
}

/**
 * @param {GridNode} node The node to change the state of.
 * @param {GridState} state The state to change the node to.
 */
function setNodeState(node, state) {
    if (!(node instanceof GridNode)) throw Error("Node parameter not an instance of GridNode!");
    node.sprite.tint = state;
}

function initGrid(w, h) {
    console.log("Initialize the grid!");
    nodeWidth = w / COLUMNS;
    nodeHeight = h / ROWS;

    for (var i = 0; i < COLUMNS; i++) {
        for (var j = 0; j < ROWS; j++) {
            grid[i][j] = new GridNode(i, j, nodeWidth, nodeHeight);
            stage.addChild(grid[i][j].sprite);
        }
    }
    renderer.render(stage);
}