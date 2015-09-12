var port = process.env.PORT || 80;

var express = require("express");
var app = express();

app.use(express.static("web"));

var server = app.listen(port);

var turnIndex = 0;

var Gun = require("gun");
var gun = Gun({
	file: "trash/" + (new Date()).getTime()
});
gun.attach(server);
server.listen(port);