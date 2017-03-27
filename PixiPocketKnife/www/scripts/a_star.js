//TODO: More efficient removeFromArray

var startNode;
var goalNode;
var closedSet = []; // Array of evaluated nodes
var openSet = []; // Array of unevaluated nodes
var path = []; // Path from startNode to goalNode (if there is one)

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

    this.startNode.setNodeState(NodeState.START);
    this.goalNode.setNodeState(NodeState.END);

    this.openSet.push(this.startNode);
    this.startNode.gScore = 0;
}

function stepAStar() {
    if (this.openSet.length > 0) {
        var cheapestIndex = 0;
        // Find the easiest node to reach next
        for (var i = 1; i < this.openSet.length; i++) {
            if (this.openSet[i].fScore < this.openSet[cheapestIndex].fScore) {
                cheapestIndex = i;
            }

            if (this.openSet[i].fScore == this.openSet[cheapestIndex].fScore) {
                if (this.openSet[i].gScore > this.openSet[cheapestIndex].gScore) {
                    cheapestIndex = i;
                }
            }
        }

        var currentNode = this.openSet[cheapestIndex];

        if (currentNode == this.goalNode) {
            console.log("Reached goal node!");
            return 1;
        }

        removeFromArray(this.openSet, currentNode);
        this.closedSet.push(currentNode);

        var neighbors = currentNode.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (!this.closedSet.includes(neighbor) && neighbor.getNodeState() != NodeState.BLOCKED) {

                neighbor.calcHScore(goalNode);
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
        }
        printAStarGrid(currentNode);

        return 0;
    }
    else {
        // No path from start to goal found
        return -1;
    }
}

function printAStarGrid(currentNode) {
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].setNodeState(NodeState.VISITED);
    }
    var tempNode = currentNode;
    tempNode.setNodeState(NodeState.END);
    while (tempNode.fromNode) {
        tempNode.fromNode.setNodeState(NodeState.END);
        tempNode = tempNode.fromNode;
    }
}