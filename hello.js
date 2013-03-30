var express = require('express');
var mustache = require('mustache');

var body = "<div id='pawnMessage'><img src='pieces/wqueen.png' /><img src='pieces/wcastle.png' />    <img src='pieces/wbishop.png' />    <img src='pieces/wknight.png' />  </div>  <div id='mateMessage'><h1>Checkmate</h1><p></p></div><div class='board'><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div><div class='black'></div><div class='white'></div></div>";

var app = express.createServer(express.logger());

app.get('/:id', function(request, response) {
  console.log('testing:' + request.params.id);
  response.send(mustache.render(body,{}));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});