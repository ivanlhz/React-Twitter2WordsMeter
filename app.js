var app = require('express')();
var server = require('http').Server(app);
var Twitter = require('twitter');
var io = require('socket.io')(server);

server.listen(3000);

var twit = new Twitter({
  consumer_key: 'mTyI1qpHWT9t0wDnqIRLGMts6',
  consumer_secret: 'BtNex6bok8iyYreo4Wjfkivkrzp3WldUCSPfQiuPG9BvLawKDY',
  access_token_key: '438218302-ISotA3VTrdCzI77KdMf7KitvuCsrD3rWUt1g2Vbo',
  access_token_secret: 'ADR4JfuQyGPcEubuiYJ8KmLEbhHetdqc6Cza7EMY4lPSw',
});
var love = 0;
var hate = 0;


twit.stream('statuses/filter',{track: 'amor'}, function(stream)
{
	stream.on('data',function(tweet)
	{
		//console.log(JSON.stringify(tweet.user, null, 2));
		love ++;
		if(tweet.user)
		{
			io.sockets.volatile.emit('tweet',
			{
				user: tweet.user.name,
				text: tweet.text,
				hate: (hate/ (love+hate) ) * 100,
				love: (love/ (love+hate) ) * 100
			})
		}
	});
	stream.on('error', function(error) {
    throw error;
  });
});
twit.stream('statuses/filter',{track: 'odio'}, function(stream)
{
	stream.on('data',function(tweet)
	{
		//console.log(JSON.stringify(tweet.user, null, 2));
		hate ++;
		if(tweet.user)
		{
			io.sockets.volatile.emit('tweet',{
					user: tweet.user.name,
					text: tweet.text,
					hate: (hate/ (love+hate) ) * 100,
					love: (love/ (love+hate) ) * 100
				})
		}
	});
	stream.on('error', function(error) {
    throw error;
  });
});


//RUTEO

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})