var express = require('express');
var app = express();
var server = require('http').Server(app);
var Twitter = require('twitter');
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var tweets = [];

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname + '/public'));

var twit = new Twitter({
  consumer_key: 'mTyI1qpHWT9t0wDnqIRLGMts6',
  consumer_secret: 'BtNex6bok8iyYreo4Wjfkivkrzp3WldUCSPfQiuPG9BvLawKDY',
  access_token_key: '438218302-ISotA3VTrdCzI77KdMf7KitvuCsrD3rWUt1g2Vbo',
  access_token_secret: 'ADR4JfuQyGPcEubuiYJ8KmLEbhHetdqc6Cza7EMY4lPSw',
});
var word1 = 'amor';
var word2 = 'odio';


//SOCEKT.IO
io.on('connection', function (socket)
{
  beginTwitStream();
});

function beginTwitStream()
{
	twit.stream('statuses/filter',{track: word1}, function(stream1)
		{
			twit.currentTwitStream1 = stream1;
			stream1.on('data',function(tweet)
			{
				if(tweet.user)
				{       var tweet_msg = {
                      image: tweet.user.profile_image_url,
                      name: tweet.user.name,
                      text: tweet.text
                    };
                tweets.push(tweet_msg);

				        io.sockets.volatile.emit('tweets',tweets);//Enviamos todos los twits a nuestro componente REACT
				}
			});
			stream1.on('error', function(error) {
		    throw error;
		  });
		});

		twit.stream('statuses/filter',{track: word2}, function(stream2)
		{
			twit.currentTwitStream2 = stream2;
			stream2.on('data',function(tweet)
			{
        if(tweet.user)
				{
          tweets.push({
            image: tweet.user.profile_image_url,
						name: tweet.user.name,
						text: tweet.text
					});
					io.sockets.volatile.emit('tweets',JSON.stringify(tweets,null,4));//Enviamos todos los Twitis a nuestro componente REACT
				}
			});
			stream2.on('error', function(error) {
		    throw error;
		  });
		});
}

//RUTEO
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
})
