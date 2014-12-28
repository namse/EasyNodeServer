
var HelloWorldLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.setColor(new cc.Color(255,255,255));

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
                NetworkManager.send('abccc');
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);



        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.Character_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 1,
            rotation: 0
        });
        this.addChild(this.sprite, 7);

        /*this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );*/
        NetworkManager.send('abc');




        return true;
    }
});

var NetworkManager = new function() {
    var _this = this;
    this.socket = io.connect();
    this.messages = [];
    this.roster = [];
    this.name = '';

    this.socket.on('connect', function () {
        _this.setName();
    });

    this.socket.on('message', function (msg) {
        _this.messages.push(msg);
    });

    this.socket.on('roster', function (names) {
        _this.roster = names;
    });

    this.send = function send(text) {
        console.log('Sending message:', text);
        this.socket.emit('message', text);
        this.text = '';
    };

    this.setName = function setName() {
        this.socket.emit('identify', name);
    };
}


var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer, 0);

    }
});

