var username = null;
while(username == null || username.length < 1 || username == "_") 
	username = prompt("What's your username?");

var isMyTurn = false;

var Gun = Gun || { };
var gun = Gun(location.origin + "/gun");

var pong = gun.get("pong").set();

var users = pong.path("users").set();
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

/*
(function(){
	var array = ['a', 'b', 'c', 'd'];
	
	var obj = {1: 'a', 2: 'b', 3: 'c'};
	
	var pong = gun.get('pong/data');
	
	pong.put({
		users: {
			'asdf': true,
			'fads': true,
			'dafs': false
		}
	});
	
	
	pong.path('users').key('players/pong').map(function(inGame, ID){
		if(inGame){
			// idemopotently add or update them.	
		} else {
			remove them;	
		}
		
	});
	
	
});

(function(){
		var pong = gun.get('pong/data');
	
		var players = gun.get('pong/room1/players');
});
*/

/*
pong 
|- users
   |- player1
   |- player2
*/

(function(){
	var pong = {};
	pong.users = {};
	var users = pong.users;
	
	users.forEach()
	pong.users.forEach()
});