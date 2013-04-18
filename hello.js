var express = require('express')
,mustache = require('mustache')
,gameplay = require(__dirname+'/static')
,CryptoJS = require('cryptojs').Crypto
,mongo = require('mongodb')
,Server = mongo.Server
,Db = mongo.Db
,con = null;

server = new Server('alex.mongohq.com', 10094, {auto_reconnect: true});
var DBCon = new Db('app13760571', server, {safe: false});
DBCon.open(function(err, db) {
  if(!err){
    db.authenticate('heroku', 'Dominica!<3', function(err){
      if(!err) con = db;
    });
  }
});

var app = express.createServer();
var io = require('socket.io').listen(app, { log: false });;

app.use("/pieces", express.static(__dirname + '/pieces'));
app.use(express.cookieParser());

app.get('/js.js', function(request, response) {
  response.header('Content-Type', 'text/javascript');
  response.send(gameplay.toString());
});

app.get('/game/:id', function(request, response) {
  var id = request.params.id;
  DBCon.collection('static').findOne({_id:'template'},function(error,template){
    DBCon.collection('games').findOne({_id:id},function(error,game){
      console.log('Looking for Game...');
      if (game == null){
        console.log('No Game Found...');
        response.send('No Game Found...');
      }else{
        console.log('Found Game...');
        var color,
        cookie = request.cookies.player,
        now = new Date().getTime(),
        hash = CryptoJS.SHA256("New"+ now +"Game"),
        expdate = new Date ();
        expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000*365));
        color = cookie == game.white ? "w" : cookie == game.black ? "b" : null;

        update = color == 'w' ? 'b' : 'w';


        response.send(mustache.render(template.css+template.body+template.board,{update:update,cookie:cookie,hash:hash,expire:expdate,game:game.game,color:color,id:id}));
      }
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


app.get('/', function(request, response) {
  var css = '<style>.onoffswitch { position: relative; width: 103px; -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none; } .onoffswitch-checkbox { display: none; } .onoffswitch-label { display: block; overflow: hidden; cursor: pointer; border: 2px solid #999999; border-radius: 20px; } .onoffswitch-inner { width: 200%; margin-left: -100%; -moz-transition: margin 0.3s ease-in 0s; -webkit-transition: margin 0.3s ease-in 0s; -o-transition: margin 0.3s ease-in 0s; transition: margin 0.3s ease-in 0s; } .onoffswitch-inner:before, .onoffswitch-inner:after { float: left; width: 50%; height: 30px; padding: 0; line-height: 30px; font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; } label[for=privacy] .onoffswitch-inner:before { content:"PUBLIC"; padding-left: 10px; background-color: #86CCE3; color: #FFFFFF; } label[for=privacy] .onoffswitch-inner:after { content:"PRIVATE"; padding-right: 10px; background-color: #AEBBE3; color: #676769; text-align: right; } label[for=color] .onoffswitch-inner:before { content:"BLACK"; padding-left: 10px; background-color: #000; color: #FFFFFF; } label[for=color] .onoffswitch-inner:after { content:"WHITE"; padding-right: 10px; background-color: #FFF; color: #000; text-align: right; } .onoffswitch-switch { width: 13px; margin: 8.5px; background: #FFFFFF; border: 2px solid #999999; border-radius: 20px; position: absolute; top: 0; bottom: 0; right: 69px; -moz-transition: all 0.3s ease-in 0s; -webkit-transition: all 0.3s ease-in 0s; -o-transition: all 0.3s ease-in 0s; transition: all 0.3s ease-in 0s; } .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner { margin-left: 0; } .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch { right: 0px; }</style>';
  var cookie = request.cookies.player;
  var body = '<script src="/socket.io/socket.io.js"></script><script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script><script>  var socket = io.connect("mongochess.herokuapp.com");socket.on("created", function(state){ color = state.created ? "success" : "error"; /*popup.addClass(color);*/ alert(color+":"+state.message);});create = function(){ name = document.getElementById("newgame").value; privacy = document.getElementById("privacy").checked ? "public" : "private"; color = document.getElementById("color").checked ? "black" : "white"; socket.emit("create",{color:color,privacy:privacy,id:name,auth:cookie}); }; var cookie = "{{^cookie}}{{hash}}{{/cookie}}{{cookie}}"; document.cookie = "player="+cookie+"; expires={{expire}}; path=/";</script><!-- <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js" /> --> <button class="submit" onclick="Javascript:create()">New Game</button> <div class="onoffswitch"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="privacy" checked /> <label class="onoffswitch-label" for="privacy"> <div class="onoffswitch-inner" id="onoffswitch-inner"></div> <div class="onoffswitch-switch"></div> </label> </div> <div class="onoffswitch"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="color" checked /> <label class="onoffswitch-label" for="color"> <div class="onoffswitch-inner" id="onoffswitch-inner"></div> <div class="onoffswitch-switch"></div> </label> </div> <input type="text" id="newgame"/>';
  var now = new Date().getTime();
  var hash = CryptoJS.SHA256("New"+ now +"Game");
  var expdate = new Date ();
  expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000*365));
  response.send(mustache.render(css+body,{cookie:cookie,hash:hash,expire:expdate}));
})

app.get('/game/:id/opp', function(request, response) {
  var now = new Date().getTime();
  var hash = CryptoJS.SHA256("New"+ now +"Game");
  var id = request.params.id;
  var cookie = request.cookies.player ? request.cookies.player : hash;
  var update;
  DBCon.collection('static').findOne({_id:'template'},function(error,template){
    DBCon.collection('games').findOne({_id:id},function(error,game){
      console.log('Looking for Game...');
      if (game == null){
        console.log('No Game Found...');
        response.send('No Game Found...');
      }else{
        console.log('Found Game...');
        if (game.white && !game.black){
          update = {black:cookie};
        }else if(!game.white && game.black){
          update = {white:cookie};
        }else{
          response.send('Game has already started');
          return;
        }
        var expire = new Date ();
        expire.setTime (expire.getTime() + (24 * 60 * 60 * 1000*365));
        DBCon.collection('games').update({_id:id},{$set: update},function (error, client) {
          if(!error)
            response.send('<script type="text/javascript">document.cookie = "player='+cookie+'; expires='+expire+'; path=/"; window.location.href="/game/'+id+'";</script>')
            //response.redirect('/game/'+id);//response.send(mustache.render(template.css+push+template.body+template.board,{game:game.game}));  
          else
            response.send('Error');
        });
      }
    });
  });
});

io.sockets.on('connection', function (socket) {
  socket.on('getGamestate',function(id){
    DBCon.collection('games').findOne({_id:id},function(error,game){
      console.log('Looking for Game...');
      if (game == null){
        console.log('No Game Found...');
        response.send('No Game Found...');
      }else{
        console.log('Found Game...');
        socket.join(game._id);
        socket.emit('setGamestate',{game:game.game,enemies:game.enemies});
      }
    });
  })
  socket.on('getTurn',function(id){
    DBCon.collection('games').findOne({_id:id},function(error,game){
      console.log('Looking for Game...');
      if (game == null){
        console.log('No Game Found...');
        response.send('No Game Found...');
      }else{
        console.log('Found Game...');
        socket.join(game._id);
        socket.emit('setTurn',{turn:game.turn});
      }
    });
  })

  socket.on('create',function(params){
    var id = params.id;
    if (!id.match("^[a-zA-Z0-9_-]*$") || id == ''){
      socket.emit({created:false,message:'Invalid Name (Alphanumeric Characters only)'});
      return;
    }
    if(!(params['color'] == 'black' || params['color'] == 'white') || !(params['privacy'] == 'public' || params['privacy'] == 'private')){
      socket.emit({created:false,message:'Stop trying to hack the API'});
      return;
    }
    DBCon.collection('static').findOne({_id:'template'},function(error,template){
      var doc;
      DBCon.collection('games').findOne({_id:id},function(error,game){
        console.log('Looking for Game...');
        if (game == null){
          console.log('No Game Found...');
          doc = {_id:id,game:{},white:'',black:'',privacy:''};
          doc.game = template.game;
          doc.turn = 'w';
          doc.privacy = params['privacy'];
          doc.enemies = template.enemies;
          if (params['color'] == 'white'){
            doc.white = params['auth'];
          }else if(params['color'] == 'black'){
            doc.black = params['auth'];
          }
          console.log('Creating Game ' + id + '...');
          DBCon.collection('games').insert(doc);
          socket.emit('created',{created:true,message:'Game Successfully Created'});
          if (params['privacy'] == 'public')
            io.sockets.emit('new',{name:id,color:params['color']});
        }else{
          console.log('Found Existing Game...');
          io.sockets.emit('created',{created:false,message:'Game Already Exists'});
        }
      });
    });
})

  socket.on('move',function(params){
    DBCon.collection('games').findOne({_id:params.id},function(error,game){
      var auth = null;
      var acol = parseInt(params.acol);
      var arow = parseInt(params.arow);
      var bcol = parseInt(params.bcol);
      var brow = parseInt(params.brow);
      var moving = game.game[arow][acol];
      var move,omove;
      if (game.white == params.auth && moving.color == 'w'){
        auth = params.auth;
        omove = 'b';
        move = 'w';
      }
      else if (game.black == params.auth && moving.color == 'b'){
        auth = params.auth;
        omove = 'w';
        move = 'b';
      }

      var verifyplay = new gameplay()
      verifyplay.square = game.game;
      verifyplay.enemies = game.enemies;

      if(auth !== null && game.turn == move && verifyplay.verify({before: [acol, arow],after: [bcol, brow]})){
        console.log('Legit Move');
        game.game[arow][acol].moved = true;
        game.game[brow][bcol] = game.game[arow][acol];
        game.game[arow][acol] = verifyplay.empty;

        for (var z = 0; z < game.enemies[move].pieces.length; z++){
          if (game.enemies[move].pieces[z][0] == acol && game.enemies[move].pieces[z][1] == arow){
            game.enemies[move].pieces[z] = [bcol,brow];
            break;
          }
        }
        for (var z = 0; z < game.enemies[omove].pieces.length; z++){
          if (game.enemies[omove].pieces[z][0] == bcol && game.enemies[omove].pieces[z][1] == brow){
            game.enemies[omove].pieces.splice(z,1);
            break;
          }
        }
        
        if (game.game[brow][bcol].piece == 'king')
          game.enemies[move].king = [bcol,brow];




        DBCon.collection('games').update({_id:params.id},{$set: {game:game.game,turn:omove,enemies:game.enemies}},function (error, client) {
          if(!error){
            console.log('Broadcasting move to others');

            switch(verifyplay.events){
              case 'castle':
                socket.broadcast.to(game._id).emit('update',{before:[acol,arow],after:[bcol,brow]});
                break;
              case 'promote':
                socket.broadcast.to(game._id).emit('update',{before:[acol,arow],after:[bcol,brow]});
                break;
              case 'pass':
                socket.broadcast.to(game._id).emit('update',{before:[acol,arow],after:[bcol,brow]});
                break;
              default:
                socket.broadcast.to(game._id).emit('update',{before:[acol,arow],after:[bcol,brow]});
                break;
            }

            if(checkmate)
              socket.broadcast.to(game._id).emit('checkmate');
            
            socket.emit('moved',{success:true});
          }else{
            console.log('Something went wrong');
            socket.emit('moved',{success:false});
          }
        });
        
      }else{
        console.log('Bad Move');
        socket.emit('moved',{success:false});
      }
    });  
  });


//db.users.find().limit(10).map( function(u) { return u.name; } );


});