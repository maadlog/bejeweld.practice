# HTML5 and Canvas 2D
## Be-kinda-jeweld

Application example using jQuery for UI purposes, and HTML5 Canvas and Javascript for rendering and game logic.

### Points of Intrest
#### Matches Algorithm
The example uses a simple implementation of the Flood Fill Algorithm
( [Explanation Here](https://en.wikipedia.org/wiki/Flood_fill) )

``` javascript
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
```

#### Images
They are absolutely _horrid_
