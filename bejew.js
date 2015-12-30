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
    var possible_colors = ["#5622AF","#CD0024","#008580","#DAB500","#DA4700","#9F007C"];
    var selected = [];
    var score;

    //Auxiliar functions
    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomColor(){
        return possible_colors[getRandomIntInclusive(0,5)];
    }

    function paint_cell(x, y,color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(x*slotSize, y*slotSize,slotSize,slotSize);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*slotSize, y*slotSize, slotSize, slotSize);
    }

    function darken(color){
        return shadeColor(color,0.5);
    }

    function shadeColor(color, percent) {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }


    //Game Functions

    function init(){

        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(render,60);

        var i,j = 0;
        for(i=0;i<rows;i++){
            grid[i]=[];
            for(j=0;j<columns;j++){
                grid[i][j] = {x:i,y:j,color:getRandomColor(),selected:false};
            }
        }

    }

    function render(){
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,w,h);

        updateGrid();

        var i,j = 0;
        for(i=0;i<rows;i++){
            for(j=0;j<columns;j++){
                var cell = grid[i][j];
                if (cell.selected) paint_cell(i,j,darken(cell.color));
                else paint_cell(i,j,cell.color);
            }
        }
    }

    function updateGrid(){
        if (selected.length==2){
            jwl_swap(selected[0],selected[1]);

            if (jwl_did_score(selected[0])) score++;

            if (jwl_did_score(selected[1])) score++;

            selected = [];
        }
    }

    function jwl_swap(fst,snd){
        var cellA =  grid[fst.x][fst.y];
        var cellB = grid[snd.x][snd.y];
        cellA.color = snd.color;
        cellB.color = fst.color;
        cellA.selected = false;
        cellB.selected = false;
    }

    function jwl_select(coord){
        var x = coord.x;
        var y = coord.y;

        selected.push({x:x,y:y,color: grid[x][y].color});
        grid[x][y].selected = true;
    }

    function jwl_did_score(jewel){
        var c = jewel.color;
        var scored = false;
        //TODO
        return true;
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
        var coord = {
            x: Math.round(((event.clientX - rect.left) + slotSize/2) * rows / w)-1,
            y: Math.round(((event.clientY - rect.top) + slotSize/2 ) * columns / h)-1
        };
        if (is_next_to(selected[0],coord) || !selected[0]) jwl_select(coord);

    });



});