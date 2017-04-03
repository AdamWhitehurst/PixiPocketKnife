//Constants
var COLUMNS = 10;
var ROWS = 18;
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
    NONE: 0xFFFFFF,
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
        this.gScore = -1;
        this.fScore = -1;
        this.hScore = 0;
        this.sprite = new PIXI.Sprite(resources["/res/icons/android/icon-96-xhdpi.png"].texture);
        this.sprite.x = this.worldPosX;
        this.sprite.y = this.worldPosY;
        this.sprite.width = width;
        this.sprite.height = height;
        this._state = GridState.NONE;
        this.fromNode = undefined; // The previous node when performing A* search. Change to array in a_star?
        this.neighbors = [];
    };

     /**
     * @param {GridState} s The state to change the node to.
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
     * Push the passed node into neighbors array (does not verify that they are actually neighbors)
     * @param {GridNode} node
     */
    pushNeighbor(node) {
        this.neighbors.push(node);
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

    // wtf ...
    //for every node in the grid
    for (var i = 0; i < COLUMNS; i++) {
        for (var j = 0; j < ROWS; j++) {
            //for each adjacent node (including diagonals)
            for (var neighborI = i - 1; neighborI <= i + 1; neighborI++) {
                for (var neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
                    //if the indeces exist in the corresponding array and aren't 0,0
                    if (neighborI in this.array) {
                        if (neighborJ in this.array[i]) {
                            if (!(neighborI == i && neighborJ == j)) {
                                this.array[i][j].neighbors.push(this.array[neighborI][neighborJ]);
                            }
                        }
                    }
                }
            }
        }
    }
    renderer.render(stage);
    return this;
}