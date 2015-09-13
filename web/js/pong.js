var username = location.hash.slice(1);
// while(username == null || username.length < 1 || username == "_") 
//	username = prompt("What's your username?");

var Gun = Gun || { };
var gun = Gun(location.origin + "/gun");

var pong = gun.get("pong").set();

var users = pong.path("users").set();
var isMyTurn;

var db = { };
db.pong = gun.get("pong").set();
db.paddle = gun.get("paddle").set();
//function determineTurn() {
	db.paddle.on(function(value) {
		if (value.lock && value.lock.length > 0) {
			isMyTurn = value.lock === username;
			if (isMyTurn) try {document.getElementById("u_" + username).style.fontWeight = "bold"; } catch(e) {}
			else try { document.getElementById("u_" + username).style.fontWeight = "normal"; } catch (e) {}
		} else {
			db.paddle.put({ "lock": username });
		}
	});
//}
//determineTurn();
var users = db.pong.path("users").set();

var obj = {}; obj[username] = { score: 0 };
users.put(obj);
var existing_users = [ ];
users.map(function(_user, _username) {
	var el;
	el = document.getElementById("u_" + _username);
	if (el == null) {
		existing_users.push(_username);
		existing_users.sort();
		el = document.createElement("li");
		el.id = "u_" + _username;
		document.getElementById("users").appendChild(el);
	}
	el.innerHTML = _username + ": " + _user["score"];
	
});


/** BEGIN GAME **/
var game = new Phaser.Game(1000, 700, Phaser.AUTO, '', {
		preload: preload, 
		create: create, 
		update: update, 
		render: render
});
var ring;
var paddle = {
		angle: 0,
		width: 0.2 * Math.PI
};
var ball = {
		x: 0, 
		y: 0, 
		radius: 15, 
		velocity: 100, 
		angle: Math.random() * Math.PI * 2 
};
var offset = 10;
var cursors;

function preload() {
    //game.load.image("background", "assets/background.jpg");
    game.load.image("circle", "assets/ball.png");
    game.load.image("paddle", "assets/paddle.png");
    game.load.image("ring", "assets/ring.png");
    game.load.physics('sprites', 'assets/sprites.json');
}
function create() {
    //game.add.tileSprite(0, 0, 800, 600, "background");

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0;

    ring = game.add.sprite(game.world.centerX, game.world.centerY, 'ring');
    paddle = game.add.sprite(game.world.centerX, game.world.centerY, 'paddle');
    //paddle.scale.setTo(0.5, 0.5);
    //paddle.pivot.x = 107;
    //paddle.pivot.y = 210;

    ball.graphics = game.add.sprite(game.world.centerX + (Math.random() * 200 - 100), game.world.centerY + (Math.random() * 200 - 100), "circle");
    ball.graphics.scale.setTo(0.75, 0.75);

    /*
    paddle.graphics = game.add.graphics(0, 0);
    paddle.sprite = game.add.sprite(game.world.centerX, game.world.centerY);
    paddle.sprite.addChild(paddle.graphics);
    */
    cursors = game.input.keyboard.createCursorKeys();
    
    //game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.p2.enable([paddle, ball.graphics, ring], true);

    paddle.body.clearShapes();
    ball.graphics.body.clearShapes();
    ring.body.clearShapes();
    paddle.body.loadPolygon('sprites', 'paddle');
    ball.graphics.body.loadPolygon('sprites', 'ball');
    ring.body.loadPolygon('sprites', 'ring');
    ball.graphics.body.velocity.y = -150;

    ball.graphics.body.onBeginContact.add(handleContact, this);

    paddle.body.static = true;
    ring.body.static = true;

    function handleContact(body, contactBody, shapeFromBody, shapeContactBody, contactEquation ){
        if(body.sprite.key === "ring") {
            // Player did miss it, as it hit the ring!
            ball.graphics.body.x = game.world.centerX;
            ball.graphics.body.y = game.world.centerY;
            ball.graphics.body.velocity.x = 0;
            ball.graphics.body.velocity.y = 0;
            setTimeout(function() {
                ball.graphics.body.velocity.y = -150;
            }, 2000);
        } else { 
            ball.graphics.body.velocity.x = ball.graphics.body.velocity.x * -1.5;
            ball.graphics.body.velocity.y = ball.graphics.body.velocity.y * -1.5;
        }

		var xvel = ball.graphics.body.velocity.destination[0];
		var yvel = ball.graphics.body.velocity.destination[1];
		var multiplier = 150 / Math.sqrt(xvel*xvel + yvel*yvel);
        ball.graphics.body.velocity.x = xvel * multiplier;
        ball.graphics.body.velocity.y = yvel * multiplier;
        //ball.graphics.body.applyImpulse([20, 20], 0, 0);
    }
            /*
            console.log("Destination 0: " + ball.graphics.body.velocity.destination[0]);
            console.log("Destination 1: " + ball.graphics.body.velocity.destination[1]);
            if(Math.abs(ball.graphics.body.velocity.x) < 150 || Math.abs(ball.graphics.body.velocity.y) < 150) {
                ball.graphics.body.velocity.destination[0] *= 5;
                ball.graphics.body.velocity.destination[1] *= 5;
            } else if(Math.abs(ball.graphics.body.velocity.x) <= 5000 && Math.abs(ball.graphics.body.velocity.y) <= 5000) {
                ball.graphics.body.velocity.x = ball.graphics.body.velocity.destination[0] * 20;
                ball.graphics.body.velocity.y = ball.graphics.body.velocity.destination[1] * 20;
                
            }*/

        //ball.graphics.body.applyImpulse([20, 20], 0, 0);
}

    
    /*
    ball.graphics.body.collideWorldBounds = true;
    ball.graphics.body.bounce.setTo(1, 1);*/
    //ball.graphics.body.velocity.setTo(ball.velocity * Math.cos(ball.angle), ball.velocity * Math.sin(ball.angle));
function update() {
    
    // ball.x += ball.velocity * Math.cos(ball.angle);
    // ball.y += ball.velocity * Math.sin(ball.angle);
    
    /* ball.graphics.clear();
    ball.graphics.beginFill(0xacffcf);
    ball.graphics.drawCircle(ball.x, ball.y, ball.radius);
    ball.graphics.endFill(); */
    /*
    var xvel = ball.graphics.body.velocity.x;
    var yvel = ball.graphics.body.velocity.y;
    var vel = Math.sqrt(xvel*xvel + yvel*yvel);
    if (Math.abs(vel - speed) > 1) {
        var multiplier = speed / vel;
        ball.graphics.body.velocity.x = xvel * multiplier;
        ball.graphics.body.velocity.y = yvel * multiplier;
    }*/
    // console.log(xvel*xvel + yvel*yvel);
    
    if (cursors.right.isDown) {
        paddle.body.rotateRight(100);
    } else if (cursors.left.isDown) {
        paddle.body.rotateLeft(100);
    } else {
        paddle.body.rotateLeft(0)
    }
}

function collisionHandler (obj1, obj2) {
    game.stage.backgroundColor = '#992d2d';
}

function render() {
    game.debug.spriteInfo(ball.graphics, 32, 32);
    game.debug.body(paddle);
    game.debug.body(ball.graphics);
}