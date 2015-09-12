var username = location.hash.slice(1);
// while(username == null || username.length < 1 || username == "_") 
//	username = prompt("What's your username?");

var Gun = Gun || { };
var gun = Gun(location.origin + "/gun");

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
		game.load.physics('sprites', 'assets/sprites.json');
}
function create() {
		//game.add.tileSprite(0, 0, 800, 600, "background");

		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 0.8;

		ring = new Phaser.Circle(game.world.centerX, game.world.centerY, 400);
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

		game.physics.p2.enable([paddle, ball.graphics], true);

		paddle.body.clearShapes();
		ball.graphics.body.clearShapes();
		paddle.body.loadPolygon('sprites', 'paddle');
		ball.graphics.body.loadPolygon('sprites', 'ball');
		ball.graphics.body.velocity.y = -150;

		ball.graphics.body.onBeginContact.add(handleContact, this);

		function handleContact(body, contactBody, shapeFromBody, shapeContactBody, contactEquation ){
				/*
				console.log(body);
				console.log(contactBody);
				console.log(shapeFromBody);
				console.log(shapeContactBody);
				console.log(contactEquation);
				*/
			var xvel = ball.graphics.body.velocity.destination[0];
			var yvel = ball.graphics.body.velocity.destination[1];
			var multiplier = 150 / Math.sqrt(xvel*xvel + yvel*yvel);
				ball.graphics.body.velocity.x = xvel * multiplier;
				ball.graphics.body.velocity.y = yvel * multiplier;
			db.paddle.put({
				lock: existing_users.sort()[(existing_users.indexOf(username) + 1)] || existing_users[0]
			});
				//ball.graphics.body.applyImpulse([20, 20], 0, 0);
		}


		//game.physics.enable(ball.graphics, Phaser.Physics.ARCADE);
		//game.physics.enable(paddle, Phaser.Physics.ARCADE);

		paddle.body.static = true;
		/*
		ball.graphics.body.collideWorldBounds = true;
		ball.graphics.body.bounce.setTo(1, 1);*/
		//ball.graphics.body.velocity.setTo(ball.velocity * Math.cos(ball.angle), ball.velocity * Math.sin(ball.angle));
}
function update() {
		game.debug.geom(ring, "#464646", false);
		//ball.graphics.body.applyImpulse([0.1, 0.1], 0, 0);
		//game.physics.arcade.collide(paddle, ball.graphics, collisionHandler, null, this);
		/*
		paddle.graphics.clear();
		paddle.graphics.lineStyle(8, 0xacffcf);
		paddle.graphics.arc(0, 0, 200, paddle.angle, paddle.angle + paddle.width);
		*/

		// ball.x += ball.velocity * Math.cos(ball.angle);
		// ball.y += ball.velocity * Math.sin(ball.angle);

		/* ball.graphics.clear();
		ball.graphics.beginFill(0xacffcf);
		ball.graphics.drawCircle(ball.x, ball.y, ball.radius);
		ball.graphics.endFill(); */

		if (isMyTurn) {
			if (cursors.right.isDown) {
					paddle.body.rotateRight(45);
			} else if (cursors.left.isDown) {
					paddle.body.rotateLeft(45);
			} else {
					paddle.body.rotateLeft(0)
			}
		}
}

function collisionHandler (obj1, obj2) {
		game.stage.backgroundColor = '#992d2d';
}

function render() {
		// game.debug.spriteInfo(ball.graphics, 32, 32);
		// game.debug.body(paddle);
		// game.debug.body(ball.graphics);
}