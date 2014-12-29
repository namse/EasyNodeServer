
var HelloWorldLayer = cc.LayerColor.extend({
    _sprite:null,
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
        this._sprite = new cc.Sprite(res.Character_png);
        this._sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 1,
            rotation: 0
        });
        this.addChild(this._sprite, 7);

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

        NetworkManager.PositionHandler = this;


        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().processEvent(event);
                }
            }, this);

        if (cc.sys.capabilities.hasOwnProperty('touches')){
            cc.eventManager.addListener({
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved:function (touches, event) {
                    var touch = touches[0];
                    if (this.prevTouchId != touch.getID())
                        this.prevTouchId = touch.getID();
                    else event.getCurrentTarget().processEvent(touches[0]);
                }
            }, this);
        }



        return true;
    },
    processEvent:function (event){
        var delta = event.getDelta();
        var curPos = cc.p(this._sprite.x, this._sprite.y);
        curPos = cc.pAdd(curPos, delta);
        curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(cc.winSize.width, cc.winSize.height));
        //this._sprite.x = curPos.x;
        //this._sprite.y = curPos.y;
        NetworkManager.setPosition(curPos);
        curPos = null;
    },

    positionHandler:function(positions){
        this._sprite.x = positions[0].x;
        this._sprite.y = positions[0].y;
    }

});

var NetworkManager = new function() {
    var _this = this;
    this.socket = io.connect();
    this.messages = [];
    this.roster = [];
    this.name = '';

    this.PositionHandler = null;


    this.socket.on('connect', function () {
        _this.setName();
    });

    this.socket.on('message', function (msg) {
        _this.messages.push(msg);
    });

    this.socket.on('roster', function (names) {
        _this.roster = names;
    });

    this.socket.on('position', function (positions){
        _this.PositionHandler.positionHandler(positions);
    })

    this.send = function send(text) {
        console.log('Sending message:', text);
        this.socket.emit('message', text);
        this.text = '';
    };

    this.setName = function setName() {
        this.socket.emit('identify', name);
    };

    this.setPosition = function setPosition(position) {
        this.socket.emit('position' , position);
    }
}


var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer, 0);

    }
});

