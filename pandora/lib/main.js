var LIVE = false;

if(LIVE){
	loadFromFirebase('prometheusjs');
}
else{
	main(FB_DATA.prometheus);
}

$('#dashboard-key').blur(function(){
	loadFromFirebase(this.innerText.toLowerCase());
});

function loadFromFirebase(key){
	toggleLoading();
	var fb = new Firebase('http://' + key + '.firebaseio.com/prometheus');
	fb.once('value', function(snapshot){
		var data = snapshot.val();
		main(data);
		toggleLoading();
	});
}

function toggleLoading(){
	if(document.body.classList.contains('loading')){
		document.body.classList.remove('loading');
	}
	else{
		document.body.classList.add('loading');
	}
}

function UserListDiv(user){
	var img = user.profile.img || user.profile.picture;
	var last = user.visits[user.visits.length-1];
	var html = '<div class="user-list-div" id="user-list-div-' + user.id + '">';
		html += '<div class="user-list-img" style="background-image: url(&quot;' + img + '&quot;);"></div>';
		html += '<div class="user-list-name">' + user.profile.name + '</div>';
		html += '<div class="user-list-info"><i class="fa fa-icon fa-eye"></i><span>' + user.visits.length + '</span><i class="fa fa-icon fa-clock-o"></i><span>' + moment(last.meta.datetime.timestamp).fromNow() + '</span></div>';
		html += '</div>';
	return html;
}

function main(data){
	var userList = document.getElementById('user-list');
		userList.innerHTML = '';
	var max = 10;
	var n = 0;
	for(var i in data.users){
		if(n < max){
			var user = data.users[i];
			var visitList = [];
			for(var i in user.visits){
				visitList.push(user.visits[i]);
			}
			user.visits = visitList;
			user.id = i;
			userList.innerHTML += UserListDiv(user);
			n++;
		}
		else{
			break;
		}
	}
	console.log("DONE");
}

var UserListBox = React.createClass({
	mixins: [ReactFireMixin],
	render: function(){
		return (
			<div className="user-list-div">
				<div className="user-list-img" style={{
					backgroundImage: 'url(' + this.props.img + ')'
				}}></div>
				<div className="user-list-name">
					{this.props.name}
				</div>
				<div className="user-list-info">
					<i className="fa fa-icon fa-eye"></i>
					<span>
						{this.props.visits}
					</span>
					<i className="fa fa-icon fa-clock-o"></i>
					<span>
						{moment(this.props.lastTime).fromNow()}
					</span>
				</div>
			</div>
		);
	}
})


  /*componentWillMount: function() {
    this.firebaseRef = new Firebase('https://ReactFireTodoApp.firebaseio.com/items/');
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key();
        items.push(item);
      }.bind(this));

      this.setState({
        items: items
      });
    }.bind(this));
  },*/


var UserModule = React.createClass({
	mixins: [ReactFireMixin],
	getInitialState: function(){
		console.log('INIT STATE')
		return {
			users: []
		}
	},
	componentWillMount: function(){
		this.firebaseRef =  new Firebase('http://prometheusjs.firebaseio.com/prometheus/users');
		var _this = this;
		this.firebaseRef.limitToLast(5).on('value', function(snapshot){
			console.log(this)
			var users = [];
			snapshot.forEach(function(childSnap){
				var user = childSnap.val();
				user.key = childSnap.key();
				var visitList = [];
				for(var i in user.visits){
					visitList.push(user.visits[i]);
				}
				user.visits = visitList;
				users.push({
					key: user.key,
					img: user.profile.img || user.profile.picture,
					name: user.profile.name,
					visits: user.visits.length,
					lastTime: user.visits[user.visits.length-1].meta.datetime.timestamp
				});
			})
			_this.setState({
				users: users
			})
		}).bind(this);
	},
	componentDidMount: function(){
		alert("MOUNTED!");
	},
	componentWillUnmount: function(){
		this.firebaseRef.off();
	},
	render: function(){
		var _this = this;
		var createUser = function(user, index){
			return (
				<UserListBox 
					name={user.name} 
					img={user.img}
					visits={user.visits}
					lastTime={user.lastTime}
					key={user.key}>
				</UserListBox>
			);
		}
		return <div>{this.state.users.map(createUser)}</div>;
		/*var userNodes = this.props.data.map(function(user){
			console.log(user)

		});
		return (
			<div className="UserModule">
				{userNodes}
			</div>
		);*/
	}
});

/*  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.text }
          <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
});*/

/*var USER_LIST = [
	{key: 0, img: 'https://lh6.googleusercontent.com/-WGzKVkRdUDw/AAAAAAAAAAI/AAAAAAAAAAw/elbqQfjFAws/photo.jpg', name: 'Vinesh', visits: 7, lastTime: Date.now()}
]*/

ReactDOM.render(
	<UserModule />,
	document.getElementById('sample')
);


var TodoList2 = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.text }
          <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
});

var TodoApp2 = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      text: ''
    };
  },

  componentWillMount: function() {
    this.firebaseRef = new Firebase('https://ReactFireTodoApp.firebaseio.com/items/');
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key();
        items.push(item);
      }.bind(this));

      this.setState({
        items: items
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  removeItem: function(key) {
    var firebaseRef = new Firebase('https://ReactFireTodoApp.firebaseio.com/items/');
    firebaseRef.child(key).remove();
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  },

  render: function() {
    return (
      <div>
        <TodoList2 items={ this.state.items } removeItem={ this.removeItem } />
        <form onSubmit={ this.handleSubmit }>
          <input onChange={ this.onChange } value={ this.state.text } />
          <button>{ 'Add #' + (this.state.items.length + 1) }</button>
        </form>
      </div>
    );
  }
});

ReactDOM.render(<TodoApp2 />, document.getElementById('content'));