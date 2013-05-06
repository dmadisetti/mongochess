    document.cookie = 'player={{cookie}}; expires={{expire}}; path=/';
    var gameplay = new gameplay();
    var socket = io.connect('http://mongochess.herokuapp.com/');
	document.addEventListener('DOMContentLoaded',function(){
        {{#color}}
	        $('img.{{color}}').draggable({
	            revert: true
	        }); 
	        $('.board > div').droppable({ 
	        	accept: $('.ui-draggable-dragging')[0], 
	        	drop: function(){ 
	        		if (!gameplay.turn){
                        if(gameplay.events == 'promoted')    
                            alert("fuck yeah");
                        else return; 
	        		var piece = $('.ui-draggable-dragging'); 
	        		var aindex = piece.parent().index('.board > div'); 
	        		var bindex = $(this).index('.board > div'); 
	        		acol = aindex % 8; bcol = bindex % 8; 
	        		arow = Math.floor(aindex/8);
	            	brow = Math.floor(bindex / 8);
	            	if (gameplay.verify({
		                before: [acol, arow],
	    	            after: [bcol, brow]
	        	    })) {
		                gameplay.turn = false;
	    	            var img = '<img src=\"' + piece.attr('src') + '\" class=\"{{color}}\" />';
	        	        piece.remove();
	            	    $(this).html(img);
	                	$('img.{{color}}').draggable({
		                    zIndex: 100,
	    	                containment: '.board',
	        	            revert: true
	            	    });
	                	gameplay.turn = false;
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
	    	});
		{{/color}}
	$('#pawnMessage').hide();  $('#pawnMessage').css( {    left: '580px',    top: '250px',    width: 0,    height: 0  } );      $('#mateMessage').hide();  $('#mateMessage').css( {    left: '580px',    top: '250px',    width: 0,    height: 0  } );
    });
  {{#color}}
    socket.on('connect', function () {
        socket.emit('getTurn', '{{id}}');  
        socket.emit('getGamestate', '{{id}}'); 
    }); 

    socket.on('setGamestate', function(game){ 
    	gameplay.square = game.game; gameplay.enemies = game.enemies; 
    });

    socket.on('setTurn', function(game){ if('{{color}}' == game.turn) gameplay.turn = true; else gameplay.turn = false; }); 
  {{/color}}

        socket.on('update', function (details) {
          {{#color}}
            socket.emit('getGamestate', '{{id}}');
            gameplay.turn = true;
          {{/color}}
            animate(details);
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
