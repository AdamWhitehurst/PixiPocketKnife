function Creature(world, x, y)
{
	this.network = new Architect.Perceptron(40, 25, 3);
	this.world = world;
    this.sprite;

    this.initSprite(x, y);
}

Creature.prototype = {
    initSprite: function (x, y) {
        if (this.sprite) {
            this.destroySprite();
        }

        this.sprite = new PIXI.Sprite(PIXI.loader.resources["images/cordova.png"].texture);

        this.sprite.buttonMode = true;
        this.sprite.interactive = true;

        this.sprite.on('pointerover', function () {
            this.sprite.height *= 1.1;
            this.sprite.width *= 1.1;
        }.bind(this));

        this.sprite.on('pointerout', function () {
            this.sprite.height /= 1.1;
            this.sprite.width /= 1.1;
        }.bind(this));

        this.sprite.height = this.world.width() / 20;
        this.sprite.width = this.world.width() / 20;

        this.sprite.x = x;
        this.sprite.y = y;

        this.world.stage.addChild(this.sprite);
    },

    destroySprite: function () {
        this.sprite.destroy();
    },

    destroy: function () {
        this.destroySprite();
    },

    draw: function () {
        
    },

    update: function () {
        
    }
};