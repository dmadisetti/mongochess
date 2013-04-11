var express = require('express')
,mustache = require('mustache')
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
  var log = "----------------------------\n";
  var id = request.params.id;
  DBCon.collection('static').findOne({_id:'template'},function(error,template){
    DBCon.collection('games').findOne({_id:id},function(error,game){
      log +='Looking for Game... \n';
      if (game == null){
        log += 'No Game Found... \n';
        response.send('No Game Found...');
      }else{
        log += ('Found Game...\n');
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
      console.log(log);
    });
  });
});







var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});











var gameplay = function gameplay (){
    var self = this;
    self.square = '';
    self.empty = { piece: "",color: ""};
    self.move = function (){
      console.log('In Move');
      self.piece = self.square[self.row][self.col];
      
      moves = self.pieces[self.piece.piece];
      for (z=0;z<moves.length;z++){
        self.movable = [];
        moves[z].kind(moves[z].funct);
        console.log(self.after +' vs '+ self.movable);
        if (self.movable.indexOf(self.after) >= 0)
          return true;
      }
      alert('Finished');
      return false;
    }
    self.verify = function (args){
        console.log('In verify');
        self.events = 'update';
        self.col = args.before[0];
        self.row = args.before[1];
        self.after = args.after[1] * 8 + args.after[0];
        if (self.move()){
          var squareholder = self.square;
          self.square[args.after[1]][args.after[0]] = self.square[self.row][self.col];
          self.square[self.row][self.col] = self.empty;
          var king = self.enemies[self.piece.color].king;
          check = self.check(self.piece.color,king[1],king[0]);
          self.square = squareholder;
          return !(check);
        }
        return false;
    }

    self.check = function (color,col,row){
      console.log('In Check');
      color = color == 'w' ? 'b' : 'w';
      self.after = col * 8 + row;
      for (z=0;z<self.enemies[color].length;z++){
        self.col = self.enemies[color][z][1];
        self.row = self.enemies[color][z][0];
        if (move())
          return true;
      }
      return false;
    }

    self.checkmate = function (args){

      self.check(args);

    }

    self.pieces = {
    'castle':[
      {funct:function (col,row){
        return [++col,row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [--col,row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [col,--row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [col,++row];
      },
       kind: longmove
      }
    ],
    'bishop':[
      {funct:function (col,row){
        return  [++col,++row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [--col,++row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [--col,--row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [++col,--row];
      },
       kind: longmove
      }
    ],  
    'knight':[
      {funct:function (col,row){
        pos = [];
        pos[0] = --col;
        pos[1] = row-=2;
        return pos;
      },
       kind: shortmove
      },
      {funct:function (col,row){
        pos = [];
        pos[0] = ++col;
        pos[1] = row-=2;
        return pos;
      },
       kind: shortmove
      },
      {funct:function (col,row){
        pos = [];
        pos[0] = --col;
        pos[1] = row+=2;
        return pos;
      },
       kind: shortmove
      },
      {funct:function (col,row){
        pos = [];
        pos[0] = ++col;
        pos[1] = row+=2;
        return pos;
      },
       kind: shortmove
      },
      {funct:function (col,row){
        pos = [];
        pos[0] = col-=2;
        pos[1] = --row;
        return pos;
      },
       kind: shortmove
      },
      {funct:function (col,row){
        pos = [];
        pos[0] = col-=2;
        pos[1] = ++row;
        return pos;
      },
       kind: shortmove
      },
      {funct:function (col,row){
        pos = [];
        pos[0] = col+=2;
        pos[1] = ++row;
        return pos;
      },
       kind: shortmove
      },
      {funct:function (col,row){
        pos = [];
        pos[0] = col+=2;
        pos[1] = --row;
        return pos;
      },
       kind: shortmove
      }
    ],
    'queen':[
      {funct:function (col,row){
        return [++col,row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [--col,row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [col,--row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [col,++row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return  [++col,++row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [--col,++row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [--col,--row];
      },
       kind: longmove
      },
      {funct:function (col,row){
        return [++col,--row];
      },
       kind: longmove
      }
    ],
    'king':[
      {funct:function (col,row){
        return [++col,row];
      },
       kind: shortmove
      },
      {funct:function (col,row){
        return [--col,row];
      },
       kind: shortmove
      },
      {funct:function (col,row){
        return [col,--row];
      },
       kind: shortmove
      },
      {funct:function (col,row){
        return [col,++row];
      },
       kind: shortmove
      },
      {funct:function (col,row){
        return  [++col,++row];
      },
       kind: shortmove
      },
      {funct:function (col,row){
        return [--col,++row];
      },
       kind: shortmove
      },
      {funct:function (col,row){
        return [--col,--row];
      },
       kind: shortmove
      },
      {funct:function (col,row){
        return [++col,--row];
      },
       kind: shortmove
      },
      {funct: function(squares){
        for (z=0;z<moves.length;z++){
          self.movable = [];
          moves[z].kind(moves[z].funct);
          for (i=0;i<squares.length;i++){
            if (self.movable.indexOf(squares[i]) >= 0)
              squares.pop(i);
          }
          if (squares.length == 0)
            return false;
        }
        return true;
      },
      kind: castle
      }
    ],
    'pawn':[
      {funct:function (col,row){
        self.piece.color == 'w' ? --row : ++row;
        return [col,row];
      },
       kind: pawnmove
      },
      {funct:function (col,row){
        if(self.piece.color == 'w'){
           --row;
           --col;
        }else{
           ++row;
           ++col;
        }
        return [col,row];
      },
       kind: pawneat
      },
      {funct:function (col,row){
        if(self.piece.color == 'w'){
           --row;
           ++col;
        }else{
           ++row;
           --col;
        }        
        return [col,row];
      },
       kind: pawneat
      }
    ]
  };


    function longmove (funct){
      var col = self.col,
      row = self.row,
      i = 0;

      while(true){
        pos = funct(col,row);
        col = pos[0];
        row = pos[1];
        if ((self.square[row]) 
          && self.square[row][col] 
          && self.square[row][col].color !== self.piece.color){
            self.movable[i++] = row * 8 + col;
            if (self.square[row][col].piece)  
              return;
        }else
          return;     
      }
    }

    function shortmove(funct){
      var col = self.col,
      row = self.row;

      pos = funct(col,row);

      col = pos[0];
      row = pos[1];
      if ((self.square[row]) 
          && (self.square[row][col]) 
          && self.square[row][col].color !== self.piece.color
      )
        self.movable = [row * 8 + col];
      return;
    }

    function castle(funct){
      // TODO: Well you know..
      // Check color then possible spots
      // Check if castle/king move

      // gameplay.castle = true;
    }

    function pawneat(funct){
      var col = self.col,
      row = self.row;

      pos = funct(col,row);

      col = pos[0];
      row = pos[1];
      if ((self.square[row]) 
          && (self.square[row][col]) 
          && self.square[row][col].color !== self.piece.color
          && self.square[row][col].piece
      ){
        self.promote = self.square[row][col].piece.color == 'w' ? row == 0 : row == 7;
        self.movable = [row * 8 + col];
      }
      return;
    }

    function pawnmove(funct){
      var promote, 
      col = self.col,
      row = self.row;

      pos = funct(col,row);
      col = pos[0];
      row = pos[1];
      if ((self.square[row]) 
          && (self.square[row][col]) 
          && !(self.square[row][col].piece)
      ){
        self.promote = self.square[row][col].piece.color == 'w' ? row == 0 : row == 7;
        self.movable[0] = row * 8 + col;
        pos = funct(col,row);
        col = pos[0];
        row = pos[1];


        if (!(self.piece.moved)
          && (self.square[row]) 
          && (self.square[row][col]) 
          && !(self.square[row][col].piece)
        )
          self.movable[1] = row * 8 + col;
      }
      return;
    }
}
var CryptoJS = require('cryptojs').Crypto;

app.get('/', function(request, response) {
  var log = "----------------------------\n";
  var css = '<style>.onoffswitch { position: relative; width: 103px; -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none; } .onoffswitch-checkbox { display: none; } .onoffswitch-label { display: block; overflow: hidden; cursor: pointer; border: 2px solid #999999; border-radius: 20px; } .onoffswitch-inner { width: 200%; margin-left: -100%; -moz-transition: margin 0.3s ease-in 0s; -webkit-transition: margin 0.3s ease-in 0s; -o-transition: margin 0.3s ease-in 0s; transition: margin 0.3s ease-in 0s; } .onoffswitch-inner:before, .onoffswitch-inner:after { float: left; width: 50%; height: 30px; padding: 0; line-height: 30px; font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; } label[for=privacy] .onoffswitch-inner:before { content:"PUBLIC"; padding-left: 10px; background-color: #86CCE3; color: #FFFFFF; } label[for=privacy] .onoffswitch-inner:after { content:"PRIVATE"; padding-right: 10px; background-color: #AEBBE3; color: #676769; text-align: right; } label[for=color] .onoffswitch-inner:before { content:"BLACK"; padding-left: 10px; background-color: #000; color: #FFFFFF; } label[for=color] .onoffswitch-inner:after { content:"WHITE"; padding-right: 10px; background-color: #FFF; color: #000; text-align: right; } .onoffswitch-switch { width: 13px; margin: 8.5px; background: #FFFFFF; border: 2px solid #999999; border-radius: 20px; position: absolute; top: 0; bottom: 0; right: 69px; -moz-transition: all 0.3s ease-in 0s; -webkit-transition: all 0.3s ease-in 0s; -o-transition: all 0.3s ease-in 0s; transition: all 0.3s ease-in 0s; } .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner { margin-left: 0; } .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch { right: 0px; }</style>';
  var cookie = request.cookies.player;
  var body = '<script src="/socket.io/socket.io.js"></script><script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script><script>  var socket = io.connect("mongochess.herokuapp.com");socket.on("created", function(state){ color = state.created ? "success" : "error"; /*popup.addClass(color);*/ alert(color+":"+state.message);});create = function(){ name = document.getElementById("newgame").value; privacy = document.getElementById("privacy").checked ? "public" : "private"; color = document.getElementById("color").checked ? "black" : "white"; socket.emit("create",{color:color,privacy:privacy,id:name,auth:cookie}); }; var cookie = "{{^cookie}}{{hash}}{{/cookie}}{{cookie}}"; document.cookie = "player="+cookie+"; expires={{expire}}; path=/";</script><!-- <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js" /> --> <button class="submit" onclick="Javascript:create()">New Game</button> <div class="onoffswitch"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="privacy" checked /> <label class="onoffswitch-label" for="privacy"> <div class="onoffswitch-inner" id="onoffswitch-inner"></div> <div class="onoffswitch-switch"></div> </label> </div> <div class="onoffswitch"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="color" checked /> <label class="onoffswitch-label" for="color"> <div class="onoffswitch-inner" id="onoffswitch-inner"></div> <div class="onoffswitch-switch"></div> </label> </div> <input type="text" id="newgame"/>';
  var now = new Date().getTime();
  var hash = CryptoJS.SHA256("New"+ now +"Game");
  var expdate = new Date ();
  console.log(log + "Right in the index " + cookie || hash);
  expdate.setTime (expdate.getTime() + (24 * 60 * 60 * 1000*365));
  response.send(mustache.render(css+body,{cookie:cookie,hash:hash,expire:expdate}));
})

app.get('/game/:id/opp', function(request, response) {
  var log = "----------------------------\n";
  var now = new Date().getTime();
  var hash = CryptoJS.SHA256("New"+ now +"Game");
  var id = request.params.id;
  var cookie = request.cookies.player ? request.cookies.player : hash;
  var update;
  log += "Opponent for game "+id+"\n";
  DBCon.collection('static').findOne({_id:'template'},function(error,template){
    DBCon.collection('games').findOne({_id:id},function(error,game){
      log += 'Looking for Game...\n';
      if (game == null){
        console.log(log + 'No Game Found...');
        response.send('No Game Found...');
      }else{
        log += 'Found Game...\n';
        if (game.white && !game.black){
          update = {black:cookie};
        }else if(!game.white && game.black){
          update = {white:cookie};
        }else{
          response.send('Game has already started');
          console.log(log+'Already started');
          return;
        }
        var expire = new Date ();
        expire.setTime (expire.getTime() + (24 * 60 * 60 * 1000*365));
        DBCon.collection('games').update({_id:id},{$set: update},function (error, client) {
          console.log(log + 'Set Cookies');
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
    var log = "----------------------------\n";
    log += "Getting game state " + id + "\n";
    DBCon.collection('games').findOne({_id:id},function(error,game){
      log += 'Looking for Game...\n';
      if (game == null){
        log += 'No Game Found...\n';
        response.send('No Game Found...');
      }else{
        log += 'Found Game...\n';
        socket.join(game._id);
        socket.emit('setGamestate',{game:game.game,enemies:game.enemies});
      }
      console.log(log);
    });
  })

  socket.on('getTurn',function(id){
    var log = "----------------------------\n";
    log += "Getting turn for " + id + "\n";
    DBCon.collection('games').findOne({_id:id},function(error,game){
      log += 'Looking for Game...\n';
      if (game == null){
        log += 'No Game Found...\n';
        response.send('No Game Found...');
      }else{
        log += 'Found Game...\n';
        socket.join(game._id);
        socket.emit('setTurn',{turn:game.turn});
      }
      console.log(log);
    });
  })

  socket.on('create',function(params){
    var log = "----------------------------\n";
    log += "Trying to make new game " + id + "\n";    
    var id = params.id;
    if (!id.match("^[a-zA-Z0-9_-]*$") || id == ''){
      console.log(log+'Bad name');
      socket.emit({created:false,message:'Invalid Name (Alphanumeric Characters only)'});
      return;
    }
    if(!(params['color'] == 'black' || params['color'] == 'white') || !(params['privacy'] == 'public' || params['privacy'] == 'private')){
      console.log(log+'Someone trying to break me!!');
      socket.emit({created:false,message:'Stop trying to hack the API'});
      return;
    }
    DBCon.collection('static').findOne({_id:'template'},function(error,template){
      var doc;
      DBCon.collection('games').findOne({_id:id},function(error,game){
        console.log('Looking for Game...\n');
        if (game == null){
          console.log('No Game Found...\n');
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
          console.log(log+'Creating Game ' + id + '...');
          DBCon.collection('games').insert(doc);
          socket.emit('created',{created:true,message:'Game Successfully Created'});
          if (params['privacy'] == 'public')
            io.sockets.emit('new',{name:id,color:params['color']});
        }else{
          console.log(log += 'Found Existing Game...');
          io.sockets.emit('created',{created:false,message:'Game Already Exists'});
        }
      });
    });
})

  socket.on('move',function(params){
    var log = "----------------------------\n";
    log += "Moving for game " + params.id + "\n";        
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
        log += 'Legit Move\n';

        console.log(game.game[brow][bcol]);
                
        game.game[brow][bcol].moved = true;
        game.game[arow][acol] = game.game[brow][bcol];
        game.game[brow][bcol] = verifyplay.empty;
        game.enemies[move].pieces[game.enemies[move].pieces.indexOf([arow,acol])] = [brow,bcol];
        if (game.game[brow][bcol].piece == 'king')
          game.enemies[move].king = [brow,bcol];

        console.log(game.game[brow][bcol]);

        var oindex = game.enemies[omove].pieces.indexOf([brow,bcol]);

        if (oindex)
          game.enemies[omove].pieces.splice(oindex,1);

        DBCon.collection('games').update({_id:params.id},{$set: {game:game.game,turn:omove,enemies:game.enemies}},function (error, client) {
          console.log(error);
          if(!error){
            console.log(log+'Broadcasting move to others');

            socket.broadcast.to(game._id).emit(verifyplay.events,{before:[acol,arow],after:[bcol,brow]}); 
            
            socket.emit('moved',{success:true});
          }else{
            console.log(log+'Something went wrong');
            socket.emit('moved',{success:false});
          }
        });
        
      }else{
        console.log(log+'Bad Move');
        socket.emit('moved',{success:false});
      }
    });  
  });


//db.users.find().limit(10).map( function(u) { return u.name; } );


});