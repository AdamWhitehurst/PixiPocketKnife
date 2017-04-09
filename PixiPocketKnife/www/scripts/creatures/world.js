var mainWorld;

function World(numCreatures) {
    this.renderer;
    this.stage;
    this.creatures;
    this.state;
    this.numCreatures = numCreatures | 2;

    // Hook up button listeners to buttons on the DOM
    this.hookBtnFunctions();

    // Load pixi texture assets
    this.loadWorld();

}

World.prototype = {
    loadWorld: function () {
        // Capture renderer and initialize a stage
        var container = $('#canvas-container');
        this.renderer = PIXI.autoDetectRenderer(container.width(), container.height(), { transparent: true });

        //Add the canvas to the HTML document
        container.append(this.renderer.view);

        //Create a container object called the `stage`
        this.stage = new PIXI.Container();

        // Populate the world with creatures
        this.populate();

        // Specific the starting state 
        this.state = this.worldUpdateLoop;
        this.renderer.render(this.stage);

        // Set up game loop ticker
        this.ticker = new PIXI.ticker.Ticker();
        this.ticker.add(this.gameLoop, this);

        // Start!
        this.ticker.start();
    },

    reload: function () {
        if (this.stage) {
            this.stage.destroy({ children: true });
        }
        this.stage = new PIXI.Container();

        this.populate();
    },

    populate: function (num) {
        this.numCreatures = num || this.numCreatures;
        this.creatures = [];

        for (var i = 0; i < this.numCreatures; i++) {

            var x = Math.random() * this.renderer.view.width;
            var y = Math.random() * this.renderer.view.height;

            this.creatures[i] = new Creature(this, x, y);
        }
    },

    worldUpdateLoop: function () {
        if (!this.creatures)
            this.populate();

        // update each creature
        var creatures = this.creatures;
        creatures.forEach(function (creature) {
            creature.update();
        }.bind(this));
    },

    gameLoop: function () {

            //Update the current game state:
            this.state();

            //Render the stage
            this.renderer.render(this.stage);
        },

    pause: function () {
            // TODO: Not stuff
    },

    resume: function () {
        this.state = this.loop;
    },

    onRedBtnClick: function () {
            this.reload();
        },
    onOrangeBtnClick: function () {
            this.state = this.pause;
        },

    onYellowBtnClick: function () {

    },

    onGreenBtnClick: function () {
            this.resume();
        },

    onBlueBtnClick: function () {

        },

    onVioletBtnClick: function () {

    },

    hookBtnFunctions: function () {
        // Hook up button event listeners to corresponding buttons on DOM
        var redBtn = document.getElementById('red-btn');
        redBtn.addEventListener('click', this.onRedBtnClick.bind(this), false);
        var orangeBtn = document.getElementById('orange-btn');
        orangeBtn.addEventListener('click', this.onOrangeBtnClick.bind(this), false);
        var yellowBtn = document.getElementById('yellow-btn');
        yellowBtn.addEventListener('click', this.onYellowBtnClick.bind(this), false);
        var greenBtn = document.getElementById('green-btn');
        greenBtn.addEventListener('click', this.onGreenBtnClick.bind(this), false);
        var blueBtn = document.getElementById('blue-btn');
        blueBtn.addEventListener('click', this.onBlueBtnClick.bind(this), false);
        var violetBtn = document.getElementById('violet-btn');
        violetBtn.addEventListener('click', this.onVioletBtnClick.bind(this), false);
    },

    height: function () {
        return this.renderer.view.height;
    },
    width: function () {
        return this.renderer.view.width;
    }
};
(function () {
    document.addEventListener('deviceready', function () {
        PIXI.loader
            .add([
                "/res/icons/android/icon-96-xhdpi.png"
            ])
            .load(function () {
                mainWorld = new World(10);
            });
    });
})();
