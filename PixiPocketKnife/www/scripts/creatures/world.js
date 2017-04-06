function World(renderer, stage, numCreatures) {
    this.renderer = renderer;
    this.stage = stage;
    this.numCreatures = numCreatures | 2;
    this.creatures;
}

World.prototype = {
    height: function () {
        return this.renderer.view.height;
    },
    width: function () {
        return this.renderer.view.width;
    },

	targetX: function (creature) {
        var cohesion = creature.cohesion(this.creatures);
        return cohesion.x / this.width();
    },

    targetY: function (creature) {
        var cohesion = creature.cohesion(this.creatures);
        return cohesion.y / this.height();
    },

    targetAngle: function (creature) {
        var alignment = creature.align(this.creatures);
		return (alignment.angle() + Math.PI) / (Math.PI*2);
    },

    populate: function (num) {
        this.numCreatures = num || this.numCreatures;
        this.creatures = [];

        for (var i = 0; i < this.numCreatures; i++) {

            var x = Math.random() * this.renderer.view.width;
            var y = Math.random() * this.renderer.view.height;

            this.creatures[i] = new Creature(this, x, y);
            this.creatures[i].velocity.random();
        }
    },

    loop: function () {

        if (this.creatures === 'undefined')
            this.populate();

        // update each creature
        var creatures = this.creatures;
        creatures.forEach(function (creature) {
            // move
            var input = [];
            for (var i in creatures) {
                input.push(creatures[i].location.x);
                input.push(creatures[i].location.y);
                input.push(creatures[i].velocity.x);
                input.push(creatures[i].velocity.y);
            }
            var output = creature.network.activate(input);
            creature.moveTo(output);

            // learn
            var learningRate = .3;
            var target = [this.targetX(creature), this.targetY(creature), this.targetAngle(creature)];
            creature.network.propagate(learningRate, target);

            // draw
            creature.draw();
        }.bind(this));
    }
};

