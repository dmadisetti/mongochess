    document.cookie = 'player={{cookie}}; expires={{expire}}; path=/';
    var recordBox = document.getElementById('history');
    var gameplay = new gameplay();
    var socket = io.connect('http://mongochess.herokuapp.com/');
    var standby,acol,bcol,brow,bcol;
	document.addEventListener('DOMContentLoaded',function(){
        {{#color}}
	        $('img.{{color}}').draggable({
	            revert: true
	        }); 
	        $('.board > div').droppable({ 
	        	accept: $('.ui-draggable-dragging')[0], 
	        	drop: function(){ 
	        		if (!gameplay.turn) return; 
	        		var piece = $('.ui-draggable-dragging'); 
	        		var aindex = piece.parent().index('.board > div'); 
	        		var bindex = $(this).index('.board > div'); 
	        		acol = aindex % 8; 
                    bcol = bindex % 8; 
	        		arow = Math.floor(aindex/8);
	            	brow = Math.floor(bindex / 8);
	            	if (gameplay.verify({
		                before: [acol, arow],
	    	            after: [bcol, brow]
	        	    })) {
		                gameplay.turn = false;
                        var img = document.createElement("img");
	    	            img.src = piece.attr('src') 
                        img.className = "{{color}}";
	        	        piece.remove();
	            	    $(this).html(img);
                        $('img.{{color}}').draggable({
		                    zIndex: 100,
	    	                containment: '.board',
	        	            revert: true
	            	    });
                        if(gameplay.events == 'promoted'){
                            standby = img;
                            var message = document.getElementById("promotion");
                            message.className = "display";
                        }else{
                            socket.emit('move', {
    		                    acol: acol,
    		                    arow: arow,
    		                    bcol: bcol,
    		                    brow: brow,
    		                    id: '{{id}}',
    		                    auth: '{{cookie}}'
    		                });
                        }
	    	        }
	        	}
	    	});


		{{/color}}
    });
  {{#color}}

        promote = function (name){
            standby.src = "/goodies/pieces/{{color}}"+name+".png";
            var message = document.getElementById("promotion");
            message.className = "message";
            socket.emit('move', {
                acol: acol,
                arow: arow,
                bcol: bcol,
                brow: brow,
                promote: name,
                id: '{{id}}',
                auth: '{{cookie}}'
            }); 
        }

    socket.on('connect', function () {
        socket.emit('getTurn', '{{id}}');  
        socket.emit('getGamestate', '{{id}}'); 
    }); 

    socket.on('setGamestate', function(game){ 
    	gameplay.square = game.game; 
        gameplay.enemies = game.enemies;
        gameplay.history = game.history; 
    });

    socket.on('setTurn', function(game){ if('{{color}}' == game.turn) gameplay.turn = true; else gameplay.turn = false; }); 
  {{/color}}

        socket.on('update', function (details) {
          {{#color}}
            socket.emit('getGamestate', '{{id}}');
            gameplay.turn = true;
          {{/color}}
            animate(details);
            if (details.promote != undefined){
                console.log('wtf');
                norm0 = details.after[1] * 8 + details.after[0] + 1;
                var piece = $('.board div:nth-child(' + norm0 + ') img');
                piece.attr('src',"/goodies/pieces/{{update}}"+details.promote+".png");
            }
        });


        socket.on("history", function (record) {
            var newRecord = document.createElement("li");
            newRecord.innerHTML = record.state +' '+record.before + ' ' + record.after + ' ' + record.piece;
            recordBox.appendChild(newRecord);
        });

        socket.on("remove", function (piece) {
            $('.board div img')[parseInt(piece.remove[1]) * 8 + parseInt(piece.remove[0])].remove();
        });

        socket.on("created", function (state) {
            color = state.created ? "success" : "error"; /*popup.addClass(color);*/
            alert(color + ":" + state.message);
        });

        create = function () {
            name = document.getElementById("newgame").value;
            privacy = document.getElementById("privacy").checked ? "public" : "private";
            color = document.getElementById("color").checked ? "black" : "white";
            socket.emit("create", {
                color: color,
                privacy: privacy,
                id: name,
                auth: "{{cookie}}"
            });
        };

        function animate(details) {

            norm0 = details.before[1] * 8 + details.before[0] + 1;
            norm1 = details.after[1] * 8 + details.after[0] + 1;
            left = -(details.before[1] - details.after[1]) * 100;
            tip = -(details.before[0] - details.after[0]) * 100;

            var piece = $('.board div:nth-child(' + norm0 + ') img');
            var img = '<img src=\"' + piece.attr('src') + '\" class=\"{{update}}\" />';
            piece.remove();
            update = $('.board div:nth-child(' + norm1 + ')');
            update.html(img);
            img = $('.board div:nth-child(' + norm1 + ') img');
            img.css({
                position: 'relative',
                left: tip + '%',
                top: left + '%'
            });
            img.animate({
                top: '0px',
                left: '0px'
            }, 'slow');
        };
