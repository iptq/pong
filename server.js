var express = require("express");
var app = express();

app.use(express.static("web"));

app.listen(process.env.PORT || 80);