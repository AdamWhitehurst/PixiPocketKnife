//TODO: More efficient removeFromArray

var startNode;
var goalNode;
var closedSet = []; // Array of evaluated nodes
var openSet = []; // Array of unevaluated nodes
var path = []; // Path from startNode to goalNode (if there is one)
var aStarDone;

/**
 * Inefficient way of removing 'node' from 'array'
 * @param {Array} array
 * @param {GridNode} node
 */
function removeFromArray(array, node) {
    if (!(array instanceof Array)) throw Error(array + " not an instance of Array!");
    if (!(node instanceof GridNode)) throw Error(node + " not an instance of GridNode!");

    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == node) {
            array.splice(i, 1);
        }
    }
}

/**
 * @param {GridNode} s start node
 * @param {GridNode} g goal node
 */
function initAStar(s, g) {
    this.startNode = s;
    this.goalNode = g;

    this.startNode.setNodeState(GridState.START);
    this.goalNode.setNodeState(GridState.END);

    this.openSet.push(this.startNode);
    this.startNode.gScore = 0;
}

function stepAStar() {
    if (this.openSet.length > 0) {
        var cheapestIndex = 0;
        for (var i = 0; i < this.openSet.length; i++) {
            if (this.openSet[i].fScore < this.openSet[cheapestIndex]) {
                cheapestIndex = i;
            }
        }
        var currentNode = this.openSet[cheapestIndex];

        if (currentNode == this.goalNode) {
            console.log("Reached goal node!");
            this.aStarDone = true;
            this.openSet = [];
        }
        removeFromArray(this.openSet, currentNode);
        this.closedSet.push(currentNode);

        var neighbors = currentNode.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            neighbor.calcHScore(currentNode);
            if (!this.closedSet.includes(neighbor)) {
                var tempG = currentNode.gScore + neighbor.hScore;

                if (!this.openSet.includes(neighbor)) {
                    this.openSet.push(neighbor);
                }
                else if (tempG >= neighbor.gScore) {
                    continue;
                }

                neighbor.gScore = tempG;
                neighbor.calcHScore(this.goalNode);

                neighbor.fScore = neighbor.gScore + neighbor.hScore;
                neighbor.fromNode = currentNode;
            }
            else {
                neighbor.gScore = tempG;
                neighbor.setNodeState(GridState.CHECKED)
                this.openSet.push(neighbor);
            }
        }
    }

    var tempNode = currentNode;
    this.path.push(tempNode);
    while (tempNode.fromNode) {
        this.path.push(tempNode.fromNode);
        tempNode.setNodeState(GridState.VISITED);
        tempNode = tempNode.fromNode;
    }

    for (var i = 0; i < this.path.length; i++) {
        this.path[i].setNodeState(GridState.VISITED);
    }
}