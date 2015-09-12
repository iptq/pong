var express = require("express");
var app = express();

app.use(express.static("web"));

var server = app.listen(process.env.PORT || 80);

var Gun = require("gun");
var gun = Gun({
	file: "data.json"
});
gun.attach(server);