var express = require('express')
,mustache = require('mustache')
,mongo = require('mongodb')
,Server = mongo.Server
,Db = mongo.Db
,con = null;

server = new Server('server', 10094, {auto_reconnect: true});
var DBCon = new Db('db', server, {safe: false});
DBCon.open(function(err, db) {
  if(!err){
    db.authenticate('user', 'pass', function(err){
      if(!err) con = db;
    });
  }
});

var app = express.createServer(express.logger());

app.use("/pieces", express.static(__dirname + '/pieces'));

app.get('/game/:id', function(request, response) {
  var id = request.params.id;
  if(id == 'favicon.ico')
    return;
  DBCon.collection('static').findOne({_id:'template'},function(error,template){
    var doc;
    DBCon.collection('games').findOne({_id:id},function(error,game){
      console.log('Looking for Game...');
      if (game == null){
        console.log('No Game Found...');
        doc = {_id:id,game:{}};
        doc.game = template.game;
        console.log('Creating Game ' + id + '...');
        DBCon.collection('games').insert(doc);
      }else{
        console.log('Found Game...');
        doc = game;
      }
      response.send(mustache.render(template.css+template.body+template.board,{game:doc.game}));
    });
  });
  
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});












    

var pieces = {
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
    }
  ]
};

    function longmove (funct){
      var self,
      col = self.col,
      row = self.row;

      while(true){
        pos = funct(col,row);
        col = pos[0];
        row = pos[1];
        if ((self.square[col]) 
          && (self.square[col][row]) 
          && self.square[col][row].color !== self.piece.color
        )
          self.movable[self.i++] = self.square[col][row];
        else
          return self.movable;     
      }
    }

    function shortmove(funct){
      var self,
      col = self.col,
      row = self.row;

      pos = funct(col,row);

      col = pos[0];
      row = pos[1];
      if ((self.square[col]) 
          && (self.square[col][row]) 
          && self.square[col][row].color !== self.piece.color
      )
         self.movable[self.i++] = self.square[col][row];
      return self.movable;
    }

var gameplay = function (){
    var self = this;
    self.move = function (){
      self.i = 0;
      self.movable = [];
      self.piece = self.square[self.col][self.row];
      moves = pieces[self.piece.name];
      for (move in moves){
        move.kind.self = self;
        self.movable = move.kind(self.movable,move.funct);
      }
      return self.movable;
    }
    self.verify = function (args,game){
        return (self.move().indexOf(after) >= 0);
    }
}

app.get('/', function(request, response) {
  var body = '<style>.onoffswitch { position: relative; width: 103px; -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none; } .onoffswitch-checkbox { display: none; } .onoffswitch-label { display: block; overflow: hidden; cursor: pointer; border: 2px solid #999999; border-radius: 20px; } .onoffswitch-inner { width: 200%; margin-left: -100%; -moz-transition: margin 0.3s ease-in 0s; -webkit-transition: margin 0.3s ease-in 0s; -o-transition: margin 0.3s ease-in 0s; transition: margin 0.3s ease-in 0s; } .onoffswitch-inner:before, .onoffswitch-inner:after { float: left; width: 50%; height: 30px; padding: 0; line-height: 30px; font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; } .onoffswitch-inner:before { content: "PUBLIC"; padding-left: 10px; background-color: #86CCE3; color: #FFFFFF; } .onoffswitch-inner:after { content: "PRIVATE"; padding-right: 10px; background-color: #AEBBE3; color: #676769; text-align: right; } .onoffswitch-switch { width: 13px; margin: 8.5px; background: #FFFFFF; border: 2px solid #999999; border-radius: 20px; position: absolute; top: 0; bottom: 0; right: 69px; -moz-transition: all 0.3s ease-in 0s; -webkit-transition: all 0.3s ease-in 0s; -o-transition: all 0.3s ease-in 0s; transition: all 0.3s ease-in 0s; } .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner { margin-left: 0; } .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch { right: 0px; }</style>';
  var css = '<button>New Game </button> <div class="onoffswitch"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked> <label class="onoffswitch-label" for="myonoffswitch"> <div class="onoffswitch-inner"></div> <div class="onoffswitch-switch"></div> </label> </div>';
  response.send(mustache.render(css+body,{}));
//gen cookie 
//gen link
//app.get('/game/:id/:hash', function(request, response) {
//var hash = require('CryptoJS').SHA256("Message");
//alert(hash.toString(CryptoJS.enc.Base64));
})

var empty

app.get('/api/:id/:auth/:acol/:arow/:bcol/:brow/', function(request, response) {
  params = request.params; //or w/e
  response.send('Success');
  return;
  DBCon.collection('games').findOne({_id:args['id']},function(error,game){
    var auth = null;
    var acol = int(params.acol);
    var arow = int(params.arow);
    var bcol = int(params.bcol);
    var brow = int(arg['brow']);
    var moving = game.game[acol][arow];
    if (game.white == params.auth && moving.color == 'w')
      auth = params.auth;
    else if (game.black == params.auth && moving.color == 'b')
      auth = args['auth'];
      
    if(auth !== null && gameplay.verify(args,game.game)){
      game.game[bcol][brow] = game.game[acol][arow];
      game.game[acol][arow] = empty;        
      DBCon.collection('games').update({_id:args['id']},{$set: {game:game.game}},function (error, client) {
        if(!error)
          response.send('Success');  
        else
          response.send('Error');
      });
      
    }else
      response.send('Cheater');
  });  
});





