var express = require('express');
var app = express();
var server = require('https').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var slideFile = './slides.json';
var positionFile = './position.json';

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	console.log('here');
	res.sendFile(__dirname + '/views/audience.html');
});

app.get('/presenter', function(req, res){
	res.sendFile(__dirname + '/views/presenter.html');
});

io.on('connection', function(socket){
	var sf = fs.readFileSync(slideFile);
	var slides = sf.length === 0 ? 0 : JSON.parse(sf);

	var pf = fs.readFileSync(positionFile);
	var position = pf.length === 0 ? 0 : JSON.parse(pf);

	socket.emit('first',{slides:slides, position:position});

	socket.on('ready', function(data){
		fs.writeFile(slideFile, JSON.stringify(data.slides), function(err){
			if(err) throw err;
		});

		fs.writeFile(positionFile, JSON.stringify(data.position), function(err){
			if(err) throw err;
		});
	});

	socket.on('slidechanged', function(data){
		socket.broadcast.emit('slidechanged', data.position);
		fs.writeFile(positionFile, JSON.stringify(data.position), function(err){
			if(err) throw err;
		});
	});
});

server.listen(8000, function(){
	console.log('Your presentation server is now up and running..');
});

