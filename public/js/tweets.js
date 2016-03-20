var Tweet = React.createClass({
    render : function(){
          return (
              <div className="tweet">
                  <div className="col-md-2">
                      <img className="img-circle" src={this.props.datos.image} />
                  </div>
                  <div className="col-md-10">
                      <h3 className="tweetTitle">{this.props.datos.name}</h3>
                      <p>{this.props.datos.text}</p>
                  </div>
              </div>
          );
    }
});
var TweetList = React.createClass({
  getInitialState: function () {
    return {
      tweets: null
    };
  },
  componentDidMount: function ()
  {
    var socket = io();
    var that = this;
    socket.on('tweets', function(tweets)
    {
      that.setState({ tweets : tweets});
    });
  },
  render : function()
  {
    var tweetsNodes = (<div>Cargando tweets...</div>);
    if(this.state.tweets != null){
      tweetsNodes = this.state.tweets.map(function(tweet){
        return (
            <Tweet datos={tweet} />
        );
      });
    }

    return(
      <div className="messageList">
            {tweetsNodes}
      </div>
    );
  }
});
var TweetBox = React.createClass({
  getInitialState: function () {
    return {
      tweets: null
    };
  },
  componentDidMount: function ()
  {
    var that = this;
    var socket = io();
    socket.on('tweets', function(tweets)
    {
      that.setState({ tweets : tweets});
    });
  },
  render: function() {
		return (
			<div className="tweetBox">
				<h3>Tweets:</h3>
				<TweetList tweets={this.state.tweets}/>
			</div>
		);
	}
});

ReactDOM.render(
  <TweetList />,
  document.getElementById("tweets")
);
