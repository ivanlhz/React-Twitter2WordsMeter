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
var word1cnt = 0;
var word2cnt = 0;
var word1 = 'amor';
var word2 = 'odio';

io.on('connection', function (socket) 
{ 
  socket.on('send words', function (data)
   {    
	     word1 = data.word1;
	     word2 = data.word2;
	     //console.log(typeof twit.currentTwitStream1 );
	     if( typeof twit.currentTwitStream1 != "undefined" && typeof twit.currentTwitStream2 != "undefined")
	     {
	     	word1cnt = 0;
	     	word2cnt = 0;
	     	twit.currentTwitStream1.destroy();
	     	twit.currentTwitStream2.destroy();
	     }
	     beginTwitStream(); 
  });
});

function beginTwitStream()
{
	twit.stream('statuses/filter',{track: word1}, function(stream1)
		{
			twit.currentTwitStream1 = stream1;
			stream1.on('data',function(tweet)
			{
				//console.log(JSON.stringify(tweet.user, null, 2));
				word1cnt ++;
				if(tweet.user)
				{
					io.sockets.volatile.emit('tweet',
					{
						user: tweet.user.name,
						text: tweet.text,
						word2cnt: (word2cnt/ (word1cnt+word2cnt) ) * 100,
						word1cnt: (word1cnt/ (word1cnt+word2cnt) ) * 100,
						word1: word1,
						word2: word2,
						total: word1cnt+word2cnt
					})
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
				//console.log(JSON.stringify(tweet.user, null, 2));
				word2cnt ++;
				if(tweet.user)
				{
					io.sockets.volatile.emit('tweet',{
							user: tweet.user.name,
							text: tweet.text,
							word2cnt: (word2cnt/ (word1cnt+word2cnt) ) * 100,
							word1cnt: (word1cnt/ (word1cnt+word2cnt) ) * 100,
							word1: word1,
							word2: word2,
							total: word1cnt+word2cnt
						})
				}
			});
			stream2.on('error', function(error) {
		    throw error;
		  });
		});
}



//RUTEO

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})