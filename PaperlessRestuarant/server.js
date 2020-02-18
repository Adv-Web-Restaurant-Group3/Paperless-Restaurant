const express = require("express");
const io = require("socket-io");
const http = require("http");
var app = express();
var server = http.createServer(app);
app.use(express.static("webapp"));

server.listen(8080, function() {
    console.log("Server running on port 8080");
});