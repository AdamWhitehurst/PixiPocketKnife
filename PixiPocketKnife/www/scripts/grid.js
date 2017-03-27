//Constants
var COLUMNS = 12;
var ROWS = 20;
//Grid Variables
var nodeWidth = 0;
var nodeHeight = 0;
var stage;
var renderer;
var array;
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
            .load(function () {
                console.log("Done loading resource!");
            });
    }
})();
//Grid Node Stuff
var NodeState = {
    NONE: 0xFFFFFF,
    RED: 0xAA3939,
    START: 0x2D882D,
    END: 0x2D882D,
    BLOCKED: 0x003333,
    VISITED: 0x226666,
    CHECKED: 0xAA6C39
}


//maybe should be static properties?
var OrthPos = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1]
];

class GridNode {
    constructor(i, j, width, height) {
        this.gridPosI = i;
        this.gridPosJ = j;
        this.worldPosX = width * i;
        this.worldPosY = height * j;
        this.gScore = -1;
        this.fScore = -1;
        this.hScore = 0;
        this.sprite = new PIXI.Sprite(resources["/res/icons/android/icon-96-xhdpi.png"].texture);
        this.sprite.x = this.worldPosX;
        this.sprite.y = this.worldPosY;
        this.sprite.width = width;
        this.sprite.height = height;
        this._state = NodeState.NONE;
        this.fromNode = undefined; // The previous node when performing A* search. Change to array in a_star?
        this.neighbors = [];

        if (Math.random() > 0.75) {
            this.setNodeState(NodeState.BLOCKED);
        }
    };

     /**
     * @param {NodeState} s The state to change the node to.
     */
    setNodeState (s) {
        this._state = s;
        this.sprite.tint = s;
        renderer.render(stage);
    };

    /**
     * Returns the node's current grid state
     */
    getNodeState () {
        return this._state;
    };

    /**
     * Finds Manhattan distance between this node and toNode
     * @param {GridNode} toNode
     */
    calcHScore(toNode) {
        var a = toNode.worldPosX - this.worldPosX;
        var b = toNode.worldPosY - this.worldPosY;

        this.hScore = Math.abs(a) + Math.abs(b);
    };
};

function initGrid(w, h) {
    nodeWidth = w / COLUMNS;
    nodeHeight = h / ROWS;

    this.array = new Array(COLUMNS);
    for (var i = 0; i < COLUMNS; i++) {
        array[i] = new Array(ROWS);
    };

    for (var i = 0; i < COLUMNS; i++) {
        for (var j = 0; j < ROWS; j++) {
            this.array[i][j] = new GridNode(i, j, nodeWidth, nodeHeight);
            stage.addChild(this.array[i][j].sprite);
            renderer.render(stage);
        }
    }

    for (var i = 0; i < COLUMNS; i++) {
        for (var j = 0; j < ROWS; j++) {
            for (var k = 0; k < 4; k++) {
                var node = getNode(this.array[i][j].gridPosI + OrthPos[k][0], this.array[i][j].gridPosJ + OrthPos[k][1]);
                if (node != null) {
                    this.array[i][j].neighbors.push(node);
                }
            }
        }
    }

    renderer.render(stage);
    return this;
};
function getNode (k, j) {
    if (k < 0 || k >= this.array.length ||
        j < 0 || j >= this.array[0].length) {
        return null;
    }
    return this.array[k][j];
};