$(document).ready(function(){
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $(canvas).width();
    var h = $(canvas).height();
    var screenw = $(document).width();
    var screenh = $(document).height();

    //Global game variables
    var slotSize = 50;
    var grid = [];
    var rows = Math.round(w/slotSize);
    var columns = Math.round(h/slotSize);
    var game_loop;
    var possible_colors = [
    	{code: "#ff3155" ,candy_code: "#dffd80" ,pos: 0},
    	{code: "#ffaf42" ,candy_code: "#ffaae9" ,pos: 1},
    	{code: "#ffed5e" ,candy_code: "#bcffff" ,pos: 2},
    	{code: "#49f770" ,candy_code: "#ffeea9" ,pos: 3},
    	{code: "#2daefd" ,candy_code: "#a6ffbd" ,pos: 4}
    	];
    var selected = [];
    var score = 0;

    var just_color = false;
    var candy_color = false;
    var black_stroke = false;

    //Jewel Images
    var jewel_images = [
	    $('#thing0'),
	    $('#thing1'),
    	$('#thing2'),
    	$('#thing3'),
    	$('#thing4')
    ];

    //Prototypes
    function Jewel(x,y,color,selected){
    	this.x = x;
    	this.y = y;
    	this.color = color;
    	this.selected = selected;
    	this._filled = false;

    	this.paint = function(darker){
    		var aux_color = this.color.code;
    		if (candy_color) aux_color = this.color.candy_code;

    		if (this.selected) aux_color = darken(aux_color);

    		this._filled = false;
    		
    		ctx.fillStyle = aux_color;
        	ctx.fillRect(this.x*slotSize, this.y*slotSize,slotSize,slotSize);

    		var img = jewel_images[this.color.pos];
    		if(img && !just_color)
    			ctx.drawImage(img[0],this.x*slotSize, this.y*slotSize,slotSize,slotSize)

        	black_stroke ? ctx.strokeStyle = "black" : ctx.strokeStyle = "white";
        	ctx.strokeRect(this.x*slotSize, this.y*slotSize, slotSize, slotSize);
    	};

    	this.replace_color = function(){
    		var next = this.color.pos + getRandomIntInclusive(1,3);
    		next = (next > 4)? next -4 : next;
    		grid[this.x][this.y].color = possible_colors[next];
    	}
    }


    //Auxiliar functions

    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomColor(){
        return possible_colors[getRandomIntInclusive(0,4)];
    }

    function darken(color){
        return shadeColor(color,-0.4);
       
    }

    function shadeColor(color, percent) {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }

    function flood_fill(jewel,color){
    	var matches = [];

    	if (jewel.color != color) return [];
    	if (jewel._filled) return [];
    	jewel._filled = true;
    	matches.push(jewel);

		if (valid_pos(jewel.x+1,jewel.y))
    		matches = matches.concat( flood_fill(grid[jewel.x+1][jewel.y],color) );
    	if (valid_pos(jewel.x,jewel.y+1))
    		matches = matches.concat( flood_fill(grid[jewel.x][jewel.y+1],color) );
    	if (valid_pos(jewel.x-1,jewel.y))
    		matches = matches.concat( flood_fill(grid[jewel.x-1][jewel.y],color) );
    	if (valid_pos(jewel.x,jewel.y-1))
    		matches = matches.concat( flood_fill(grid[jewel.x][jewel.y-1],color) );

    	return matches;

    }

    function valid_pos(x,y){
    	return (x >= 0 && x<rows && y>= 0 && y<columns);

    }

    //Game Functions

    function init(){

        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(render,60);

        var i,j = 0;
        for(i=0;i<rows;i++){
            grid[i]=[];
            for(j=0;j<columns;j++){
                grid[i][j] = new Jewel(i,j,getRandomColor(),false);
            }
        }

    }

    function render(){
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,w,h);

        updateGrid();

        just_color = $('#just_color')[0].checked;
        candy_color = $('#candy_color')[0].checked;
		black_stroke = $('#black_stroke')[0].checked;
         

        var i,j = 0;
        for(i=0;i<rows;i++){
            for(j=0;j<columns;j++){
                grid[i][j].paint();
            }
        }
    }

    function updateGrid(){
        if (selected.length==2){
            jwl_swap(selected[0],selected[1]);

            jwl_score(selected[0]);

            jwl_score(selected[1]);

            $('#score').text(score);

            selected = [];
        }
    }

    function jwl_swap(fst,snd){
        var cellA =  grid[fst.x][fst.y];
        var cellB = grid[snd.x][snd.y];

        var aux_color = fst.color
        cellA.color = snd.color;
        cellB.color = aux_color;
        cellA.selected = false;
        cellB.selected = false;
    }

    function jwl_select(selected_cell){
        var x = selected_cell.x;
        var y = selected_cell.y;

        selected.push(grid[x][y]);

        grid[x][y].selected = true;
    }

    function jwl_score(jewel){
        var grid_jewel = grid[jewel.x][jewel.y];
        
        var matches = flood_fill(grid_jewel,grid_jewel.color);

        if (matches.length >= 3){
        	score += matches.length*10;
        	matches.forEach(function(element){
        		element.replace_color();
        	});
        }

    }

    function is_next_to(jewelA,jewelB){
        if (!jewelA) return false;
        var difX = Math.abs(jewelA.x - jewelB.x);
        var difY = Math.abs(jewelA.y - jewelB.y);

        return ((difX == 1 && difY == 0) || (difX == 0 && difY == 1));
    }

    init();

    $(document).on("click",function(event){

        var rect = canvas.getBoundingClientRect();
        var selected_cell = {
            x: Math.round(((event.clientX - rect.left) + slotSize/2) * rows / w)-1,
            y: Math.round(((event.clientY - rect.top) + slotSize/2 ) * columns / h)-1
        };
        if (!valid_pos(selected_cell.x,selected_cell.y)) return ;
        if (is_next_to(selected[0],selected_cell) || !selected[0]) jwl_select(selected_cell);

    });



});