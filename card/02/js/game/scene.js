class Scene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("block1", "./image/1.png");
        this.load.image("block2", "./image/2.png");
        this.load.image("block3", "./image/3.png");
        this.load.image("block4", "./image/4.png");
        this.load.image("block5", "./image/5.png");
        this.load.image("block6", "./image/6.png");
        this.load.image("block7", "./image/7.png");
        this.load.image("block8", "./image/8.png");
        this.load.image("block9", "./image/9.png");
        this.load.image("dog","./image/dog.png");
        this.load.image("duck","./image/duck.png");
        this.load.image("monkey","./image/monkey.png");
        this.load.image("pig","./image/pig.png");
        this.load.image("toy","./image/toy.png");
        this.load.image("rackleft", "./image/left.png");
        this.load.image("rackright", "./image/right.png");
        this.load.image("rackqueue", "./image/queue.png");
        this.load.image("rackqueueTouch", "./image/queueTouch.png");
        this.load.image("rackrightTouch", "./image/rightTouch.png");
        this.load.image("rackleftTouch", "./image/leftTouch.png");
        this.load.image("progressbar", "./image/progressbar.png");
        this.load.image("ball", "./image/ball.png");
        this.load.text("level", "./data/level.json");
        this.load.spritesheet('sound', "./image/sound.png", {
            frameWidth: 50,
            frameHeight: 50
        });
        this.load.audio('speak', "/card/02/sound/1.mp3");
    }

    create() {
        this.add.image(480, 30, "progressbar");
        this.scales = new Scales(this);
        this.rackleft = new Rack(this, 136, 233, "rackleft");
        this.rackright = new Rack(this, 464, 233, "rackright");
        this.rackqueue = new Rack(this, 330, 480, "rackqueue");
        this.rackqueue.createDragRack(this, "rackqueueTouch");
        this.rackleft.createDragRack(this, "rackleftTouch");
        this.rackright.createDragRack(this, "rackrightTouch");
        this.gift = null;
        this.level = 1;
        this.data = JSON.parse(this.cache.text.get("level")).level;
        this.setData(this.data[this.level - 1]);
        this.input.on("gameobjectup", this.onStop, this);
        this.input.on("drag", this.onDoDrag, this);
        this.scales.draw(
            this.scales.compare(this.rackleft, this.rackright),
            this.rackleft,
            this.rackright
        );

        this.balls = this.physics.add.group({
            key: "ball",
            repeat: 4,
            setXY: {
                x: 215,
                y: 30,
                stepX: 30,
            },
        });

        this.buttons = new Button(this, 20, 20);
        this.sound = new Sound(this, 150, 100);
    }

    update() {
        var list = this.balls.getChildren();
        if (this.scales.isBalance(this.rackleft, this.rackright)) {
            if (this.level === 5)
                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        window.location = "/lesson/weight.html";
                    },
                    loop: false,
                });
            if(this.level !==5){
                list[list.length - this.level].x += 415;
                this.level++;
                this.reset();
                this.setData(this.data[this.level - 1]);
                this.scales.draw(
                    this.scales.compare(this.rackleft, this.rackright),
                    this.rackleft,
                    this.rackright
                );
            }
        }
    }

    onDoDrag(pointer, gameObject, dragX, dragY) {
        if (dragX + gameObject.width > config.width) {
            gameObject.y = dragY;
        } else if (dragX < 0) {
            gameObject.x = 0;
        } else {
            gameObject.x = dragX;
        }

        if (dragY < 0) {
            gameObject.y = 0;
        } else if (dragY + gameObject.height > config.height) {
            gameObject.y = config.height - gameObject.height;
        } else {
            gameObject.y = dragY;
        }

        if (
            gameObject.x < this.rackqueue.x + this.rackqueue.width &&
            gameObject.x > this.rackqueue.x &&
            gameObject.y + gameObject.height <
            this.rackqueue.y + this.rackqueue.height &&
            gameObject.y + gameObject.height >
            this.rackqueue.y + this.rackqueue.height / 2
        ) {
            this.rackqueue.updateRackTouch();
            this.rackqueue.rackTouch.turnOn();
        } else {
            this.rackqueue.rackTouch.turnOff();
        }
        if (
            gameObject.x < this.rackleft.x + this.rackleft.width &&
            gameObject.x > this.rackleft.x &&
            gameObject.y < this.rackleft.y + this.rackleft.height &&
            gameObject.y > this.rackleft.y
        ) {
            this.rackleft.updateRackTouch();
            this.rackleft.rackTouch.turnOn();
        } else {
            this.rackleft.rackTouch.turnOff();
        }
        if (
            gameObject.x < this.rackright.x + this.rackright.width &&
            gameObject.x > this.rackright.x &&
            gameObject.y + gameObject.height <
            this.rackright.y + this.rackright.height &&
            gameObject.y + gameObject.height >
            this.rackright.y + this.rackright.height / 2
        ) {
            this.rackright.updateRackTouch();
            this.rackright.rackTouch.turnOn();
        } else {
            this.rackright.rackTouch.turnOff();
        }
    }

    onStop(pointer, gameObject) {
        this.rackqueue.rackTouch.turnOff();
        this.rackleft.rackTouch.turnOff();
        this.rackright.rackTouch.turnOff();
        if (
            gameObject.x < this.rackqueue.x + this.rackqueue.width &&
            gameObject.x > this.rackqueue.x &&
            gameObject.y + gameObject.height <
            this.rackqueue.y + this.rackqueue.height &&
            gameObject.y + gameObject.height >
            this.rackqueue.y + this.rackqueue.height / 2
        ) {
            this.rackqueue.addBlocks(gameObject);
            this.rackright.removeBlocks(gameObject);
            this.rackleft.removeBlocks(gameObject);
            this.scales.draw(
                this.scales.compare(this.rackleft, this.rackright),
                this.rackleft,
                this.rackright
            );
        } else if (
            gameObject.x < this.rackleft.x + this.rackleft.width &&
            gameObject.x > this.rackleft.x &&
            gameObject.y < this.rackleft.y + this.rackleft.height &&
            gameObject.y > this.rackleft.y
        ) {
            this.rackleft.addBlocks(gameObject);
            this.rackright.removeBlocks(gameObject);
            this.rackqueue.removeBlocks(gameObject);
            this.scales.draw(
                this.scales.compare(this.rackleft, this.rackright),
                this.rackleft,
                this.rackright
            );
        } else if (
            gameObject.x < this.rackright.x + this.rackright.width &&
            gameObject.x > this.rackright.x &&
            gameObject.y + gameObject.height <
            this.rackright.y + this.rackright.height &&
            gameObject.y + gameObject.height >
            this.rackright.y + this.rackright.height / 2
        ) {
            this.rackright.addBlocks(gameObject);
            this.rackleft.removeBlocks(gameObject);
            this.rackqueue.removeBlocks(gameObject);
            this.scales.draw(
                this.scales.compare(this.rackleft, this.rackright),
                this.rackleft,
                this.rackright
            );
        } else {
            this.moveToXY(gameObject, gameObject.xOld, gameObject.yOld, 500);
        }
    }

    reset() {
        this.gift = null;
        this.rackleft.reset();
        this.rackright.reset();
        this.rackqueue.reset();
    }

    setData(data) {
        this.setRackqueue(data.rackQueue);
        this.setRackright(data.rackRight);
        this.setGift(data.gift);
    }

    setRackright(data) {
        for (var i = 0; i < data.length; i++) {
            this.rackright.addBlocks(this.setBlock(data[i]));
        }
    }

    setRackqueue(data) {
        for (var i = 0; i < data.length; i++) {
            this.rackqueue.addBlocks(this.setBlock(data[i]));
        }
    }

    setGift(data) {
        this.gift = this.setBlockGift(data);
        this.gift.offMove();
        this.rackleft.addBlocks(this.gift);
    }

    allOfMove() {

    }

    allOnMove() {

    }
    moveToXY(object, x, y, maxTime) {
        var dx = x - object.x;
        var dy = y - object.y;
        var angle = Math.atan2(dy, dx);
        var distance = Math.sqrt(dx * dx + dy * dy);
        var speed = distance / (maxTime / 1000);
        object.setVelocityX(Math.cos(angle) * speed);
        object.setVelocityY(Math.sin(angle) * speed);

        this.time.addEvent({
            delay: maxTime,
            callback: () => {
                object.x = x;
                object.y = y;
                object.setVelocityX(0);
                object.setVelocityY(0);
            },
            loop: false,
        });
    }

    setBlock(weight) {
        switch (weight) {
            case 1:
                return new Block(this, 0, 0, 1, "block1");
            case 2:
                return new Block(this, 0, 0, 2, "block2");
            case 3:
                return new Block(this, 0, 0, 3, "block3");
            case 4:
                return new Block(this, 0, 0, 4, "block4");
            case 5:
                return new Block(this, 0, 0, 5, "block5");
            case 6:
                return new Block(this, 0, 0, 6, "block6");
            case 7:
                return new Block(this, 0, 0, 7, "block7");
            case 8:
                return new Block(this, 0, 0, 8, "block8");
            case 9:
                return new Block(this, 0, 0, 9, "block9");
        }
    }
    setBlockGift(weight){
        switch (weight) {
            case 5:
                return new Block(this, 0, 0, 5, "toy");
            case 8:
                return new Block(this, 0, 0, 8, "pig");
            case 6:
                return new Block(this, 0, 0, 6, "monkey");
            case 1:
                return new Block(this, 0, 0, 1, "duck");
            case 9:
                return new Block(this, 0, 0, 9, "dog");
        }
    }

}