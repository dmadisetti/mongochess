var gameplay = function gameplay (){
    var self = this;
    self.empty = { piece: "",color: ""};
    self.move = function (){
      console.log('In Move');
      self.piece = self.square[self.row][self.col];
      
      moves = self.pieces[self.piece.piece];
      for (var z=0;z<moves.length;z++){
        self.movable = [];
        moves[z].kind(moves[z].funct);
        console.log(self.after +' vs '+ self.movable);
        if (self.movable.indexOf(self.after) >= 0)
          return true;
      }
      return false;
    }
    self.verify = function (args){
        console.log('In verify');
        self.args = args;
        self.events = 'update';
        self.col = args.before[0];
        self.row = args.before[1];
        self.after = args.after[1] * 8 + args.after[0];
        if (self.move()){

          if(self.events == 'castle')
            return true;


          var color = self.piece.color == 'w' ? 'b' : 'w';
          
          var squareholder = self.square;
          var enemyholder = self.enemies;
          var eventholder = self.events;
          self.square = JSON.parse(JSON.stringify(self.square));
          self.enemies = JSON.parse(JSON.stringify(self.enemies));
          
          if(self.square[args.after[1]][args.after[0]].piece){
            for (var z=0;z<self.enemies[color].pieces.length;z++){
              console.log(self.enemies[color].pieces[z][0]+ '=='+ args.after[0] +'&&'+ self.enemies[color].pieces[z][1]+ '=='+ args.after[1]);
              if(self.enemies[color].pieces[z][0] == args.after[0] && self.enemies[color].pieces[z][1] == args.after[1] ){
                self.enemies[color].pieces.splice(z, 1);
                break;
              }
            }
          }
          
          self.square[args.after[1]][args.after[0]] = self.square[self.row][self.col];
          self.square[self.row][self.col] = self.empty;
          if (self.piece.piece == 'king'){
            self.enemies[self.piece.color].king = [args.after[0],args.after[1]];
            console.log('I madde it');
          }
          var king = self.enemies[self.piece.color].king;
          check = self.check(color,king[1],king[0]);
          
          self.square = squareholder;
          self.enemies = enemyholder;
          self.events = eventholder;
          
          return !(check);
        }
        return false;
    }

    self.check = function (color,col,row){
      console.log('In Check');
      self.after = col * 8 + row;

      for (var z=0;z<self.enemies[color].pieces.length;z++){
        self.col = self.enemies[color].pieces[z][0];
        self.row = self.enemies[color].pieces[z][1];
        if (self.move())
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
      {funct: function(squares,clr){
        var all = [];
        var color = clr == 'w' ? 'b' : 'w';
        var col = parseInt(self.col);
        var row = parseInt(self.row);
        
        var pieceholder = JSON.parse(JSON.stringify(self.piece));

        for (var z=0; z<self.enemies[color].pieces.length;z++){
          self.col = self.enemies[color].pieces[z][0];
          self.row = self.enemies[color].pieces[z][1];
          
          self.piece = self.square[self.row][self.col];      
          moves = self.pieces[self.piece.piece];
          
          for (var i=0;i<moves.length;i++){
            self.movable = [];
            moves[i].kind(moves[i].funct);
            all.push(self.movable);
          }
        }
        self.piece = pieceholder;
        self.col = col;
        self.row = row;
        all = [].concat.apply([],all);
 
        for (var z=0;z<squares.length;z++){
          if(all.indexOf(squares[z]) >=0)
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
      var col = self.col,
      row = self.row;
      squares = [];

      if((self.piece.moved))
        return;

      squares.push(row * 8 + col)

      if(self.after % 8 == 2){
        if(self.square[row][--col].piece)
          return;
        squares.push(row * 8 + col)
        if(self.square[row][--col].piece)
          return;
        squares.push(row * 8 + col)
        castle = row * 8 + col;
        if(self.square[row][--col].piece)
          return;
        col--;
        if(self.square[row][col].moved || self.square[row][col].piece != 'castle')
          return;    
        self.side = 'left';
      }else if (self.after % 8 == 6){
        if(self.square[row][++col].piece)
          return;
        squares.push(row * 8 + col);
        if(self.square[row][++col].piece)
          return;
        squares.push(row * 8 + col);
        castle = row * 8 + col;
        col++;
        if(self.square[row][col].moved || self.square[row][col].piece != 'castle')
          return;
        self.side = 'right';
      }else{
        return;
      }

      if(funct(squares,self.piece.color)){
        self.events = 'castle';
        self.movable = [castle];
      }
    }
    function pawneat(funct){
      var promoted,
      col = self.col,
      row = self.row;

      pos = funct(col,row);

      col = pos[0];
      row = pos[1];
      if ((self.square[row]) 
          && (self.square[row][col]) 
          && self.square[row][col].color !== self.piece.color
          && self.square[row][col].piece
      ){
        promoted = self.piece.color == 'w' ? row == 0 : row == 7;
        if(promoted)
          self.events = 'promoted';
        self.movable = [row * 8 + col];
      }
      return;
    }

    function pawnmove(funct){
      var promoted,
      col = self.col,
      row = self.row;

      pos = funct(col,row);
      col = pos[0];
      row = pos[1];
      if ((self.square[row]) 
          && (self.square[row][col]) 
          && !(self.square[row][col].piece)
      ){
        promoted = self.piece.color == 'w' ? row == 0 : row == 7;
        if(promoted)
          self.events = 'promoted';

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


if(module)
  module.exports.gameplay = gameplay;