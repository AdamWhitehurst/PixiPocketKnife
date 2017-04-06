function Creature(world, x, y)
{
	this.network = new Architect.Perceptron(40, 25, 3);
	this.world = world;
	this.mass = .3;
	this.maxspeed = 2;
	this.maxforce = .2;
	this.lookRange = this.mass * 200;
	this.length = this.mass * 10;
	this.base = this.length * .5;
	this.HALF_PI = Math.PI * .5;
	this.TWO_PI = Math.PI * 2;
	this.location = new Vector(x, y);
	this.velocity = new Vector(0, 0);
	this.acceleration = new Vector(0, 0);
    this.color = "#222222";
    this.sprite;
}

Creature.prototype = {
    initSprite: function () {
        this.sprite = new PIXI.Sprite(PIXI.loader.resources["/res/icons/android/icon-96-xhdpi.png"].texture);

        this.sprite.buttonMode = true;
        this.sprite.interactive = true;

        this.sprite.on('pointerdown', function () {
            this.sprite.height *= 1.1;
            this.sprite.width *= 1.1
        });

        this.sprite.on('pointerup', function () {
            this.sprite.height /= 1.1;
            this.sprite.width /= 1.1
        });

        this.sprite.height = world.width() / 20;
        this.sprite.width = world.width() / 20;

        world.stage.addChild(this.sprite);
    },

    moveTo: function (networkOutput) {
        var force = new Vector(0, 0);

        var target = new Vector(networkOutput[0] * this.world.width(), networkOutput[1] * this.world.height());
        var angle = networkOutput[2] * this.TWO_PI - Math.PI;

        var separation = this.separate(this.world.creatures);
        var alignment = this.align(this.world.creatures).setAngle(angle);
        var cohesion = this.seek(target);

        force.add(separation);
        force.add(alignment);
        force.add(cohesion);

        this.applyForce(force);
    },

    draw: function () {
        this.update();

        var angle = this.velocity.angle();

        x1 = this.location.x + Math.cos(angle) * this.base;
        y1 = this.location.y + Math.sin(angle) * this.base;

        x2 = this.location.x + Math.cos(angle + this.HALF_PI) * this.base;
        y2 = this.location.y + Math.sin(angle + this.HALF_PI) * this.base;

        x3 = this.location.x + Math.cos(angle - this.HALF_PI) * this.base;
        y3 = this.location.y + Math.sin(angle - this.HALF_PI) * this.base;
        this.sprite.x = x1;
        this.sprite.y = y1;
    },

    update: function () {
        this.boundaries();
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        if (this.velocity.mag() < 1.5)
            this.velocity.setMag(1.5);
        this.location.add(this.velocity);
        this.acceleration.mul(0);
    },

    applyForce: function (force) {
        this.acceleration.add(force);
    },

    boundaries: function () {

        if (this.location.x < 15)
            this.applyForce(new Vector(this.maxforce * 2, 0));

        if (this.location.x > this.world.width() - 15)
            this.applyForce(new Vector(-this.maxforce * 2, 0));

        if (this.location.y < 15)
            this.applyForce(new Vector(0, this.maxforce * 2));

        if (this.location.y > this.world.height() - 15)
            this.applyForce(new Vector(0, -this.maxforce * 2));

    },

    seek: function (target) {
        var seek = target.copy().sub(this.location);
        seek.normalize();
        seek.mul(this.maxspeed);
        seek.sub(this.velocity).limit(0.3);

        return seek;
    },

    separate: function (neighbors) {
        var sum = new Vector(0, 0);
        var count = 0;

        neighbors.forEach(function (neighbor) {
            if (neighbor != this) {
                var d = this.location.dist(neighbor.location);
                if (d < 24 && d > 0) {
                    var diff = this.location.copy().sub(neighbor.location);
                    diff.normalize();
                    diff.div(d);
                    sum.add(diff);
                    count++;
                }
            }
        }.bind(this));

        if (!count)
            return sum;

        sum.div(count);
        sum.normalize();
        sum.mul(this.maxspeed);
        sum.sub(this.velocity);
        sum.limit(this.maxforce);

        return sum.mul(2);
    },

    align: function (neighbors) {
        var sum = new Vector(0, 0);
        var count = 0;
        neighbors.forEach(function (neighbor) {
            if (neighbor != this)// && !neighbors[i].special)
            {
                sum.add(neighbor.velocity);
                count++;
            }
        }.bind(this));

        sum.div(count);
        sum.normalize();
        sum.mul(this.maxspeed);

        sum.sub(this.velocity).limit(this.maxspeed);

        return sum.limit(.1);
    },

    cohesion: function (neighbors) {
        var sum = new Vector(0, 0);
        var count = 0;
        neighbors.forEach(function (neighbor) {
            if (neighbor != this)// && !neighbors[i].special)
            {
                sum.add(neighbor.location);
                count++;
            }
        }.bind(this));
        sum.div(count);

        return sum;
    }
};