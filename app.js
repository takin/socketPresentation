var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/audience.html');
});

app.get('/p', function(req, res){
	res.sendFile(__dirname + '/views/presenter.html');
});

io.on('connection', function(socket){
	socket.on('slidechanged', function(data){
		socket.broadcast.emit('slidechanged', data);
	});
});

server.listen(8000);

