var express = require('express');
var Twitter = require('twitter');
var app = express();
var io = require('socket.io').listen(app);

/*app.get('/', function (req, res) {
  res.send('Hello World')
})*/

var twit = new Twitter({
  consumer_key: 'mTyI1qpHWT9t0wDnqIRLGMts6',
  consumer_secret: 'BtNex6bok8iyYreo4Wjfkivkrzp3WldUCSPfQiuPG9BvLawKDY',
  access_token_key: '438218302-ISotA3VTrdCzI77KdMf7KitvuCsrD3rWUt1g2Vbo',
  access_token_secret: 'ADR4JfuQyGPcEubuiYJ8KmLEbhHetdqc6Cza7EMY4lPSw',
});

twit.stream('statuses/filter',{track: 'love,hate'}, function(stream)
{
	stream.on('data',function(tweet)
	{
		console.log(tweet.user +' : ' + tweet.text);
	});
	stream.on('error', function(error) {
    throw error;
  });
});

app.listen(3000);