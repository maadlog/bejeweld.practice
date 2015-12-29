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
    var possible_gems = ["#grape","#lemon","#orange","#diamond"];
    var selected = [];

    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function getRandomGem(){
        return possible_gems[getRandomIntInclusive(0,3)];
    }



    function init(){

        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(render,60);

        var i,j = 0;
        for(i=0;i<rows;i++){
            grid[i]=[];
            for(j=0;j<columns;j++){
                grid[i][j] = getRandomGem();
            }
        }

    }

    init();

    function render(){
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,w,h);

        updateGrid();

        var i,j = 0;
        for(i=0;i<rows;i++){
            for(j=0;j<columns;j++){
                var col = grid[i][j];
                paint_cell(i,j,col);
            }
        }
    }

    function paint_cell(x, y,color)
    {
        var item = $(color);
        ctx.drawImage(item,x*slotSize, y*slotSize);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*slotSize, y*slotSize, slotSize, slotSize);
    }

    function updateGrid(){
        if (selected.length==2){
            jwl_swap(selected[0],selected[1]);
            selected = [];
        }
    }

    function  jwl_swap(fst,snd){
        grid[fst.x][fst.y] = snd.color;
        grid[snd.x][snd.y] = fst.color;
    }

    function jwl_select(coord){
        var x = Math.round((coord.x + slotSize/2) * rows / w)-1;
        var y = Math.round((coord.y + slotSize/2 ) * columns / h)-1;

        selected.push({x:x,y:y,color: grid[x][y]});
    }

    $(document).on("click",function(event){

        var rect = canvas.getBoundingClientRect();
        var coord = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        jwl_select(coord);

    });

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function insideCanvas(coord){
        return true;
    }

});