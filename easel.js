function init(){
	
	//Configure EaselJS
	console.log("EaselJS at YO SERVICE BROTHA");	
	var stage = new createjs.Stage("myCanvas");
 	createjs.Touch.enable(stage);


/**************************************************SHAPE DRAW**************************************************/
	
	//While mousedown function: draws a shape
	function shapeDraw(start,shape) {
		//Get shape choice and modify according to whether ShiftKey is down.
		var shape_name = getChoice("Shapes");
		if(shiftDown && shape_name=="Rectangle"){
			shape_name = "Square";
		}
		else if(!shiftDown && shape_name=="Square"){
			shape_name = "Rectangle";
		}
		if(shiftDown && shape_name == "Oval"){
			shape_name = "Circle";
		}
		else if(!shiftDown && shape_name == "Circle"){
			shape_name = "Oval";
		}

		//clear last update of shape
		shape.graphics.clear();

		//mouse x and y distances from start point
    	var diffx = mouse[0]-start[0];
    	var diffy = mouse[1]-start[1];
    	
	   //  	DRAW STRAIGHT LINE:
	   //  	if(shape_name == "Line"){
	   //  		ctx.lineWidth = 3;
				// ctx.lineJoin = 'round';
				// ctx.lineCap = 'round';
	   //  		ctx.strokeStyle = colors[getChoice("Colors")];

	   //  		ctx.moveTo(start[0], start[1]);
	   //  		ctx.beginPath();
	   //  		ctx.lineTo(mouse[0], mouse[1]);
	   //  		ctx.stroke();
	   //  	}

    	//DRAW OVAL:
    	if(shape_name == "Oval"){
			shape.graphics.beginStroke("#000000").beginFill(getChoice("Colors")).drawEllipse(0,0,diffx,diffy);
			shape.x = start[0];
			shape.y = start[1];    		
    	}
    	//DRAW CIRCLE:
    	if(shape_name == "Circle"){
	    	var radius = Math.max(Math.abs(diffx),Math.abs(diffy))/2.0;			
			shape.graphics.beginStroke("#000000").beginFill(getChoice("Colors")).drawCircle(0, 0, radius);

			//Allows drawing shapes in all directions
			shape.x = start[0]+radius;
			shape.y = start[1]+radius;
			
			if(diffx<0){
				shape.x = shape.x-2*radius; 
			}
			if(diffy<0){
				shape.y = shape.y-2*radius;
			}
		}  
    	//DRAW RECTANGLE
    	else if(shape_name == "Rectangle"){
			shape.graphics.beginStroke("#000000").beginFill(getChoice("Colors")).drawRect(0,0,diffx,diffy);
			shape.x = start[0];
			shape.y = start[1];
    	}
    	//DRAW SQUARE
    	else if(shape_name == "Square"){
    		if (Math.abs(diffx)>=Math.abs(diffy)){
   				sidex = Math.abs(diffx);
   				sidey = Math.abs(diffx);
    		}
    		else{
    			sidex = Math.abs(diffy);
    			sidey = Math.abs(diffy);
    		}
    		if (diffx < 0){
    			sidex = -sidex;
    		}
    		if (diffy < 0){
    			sidey = -sidey;
    		}
    		shape.graphics.beginStroke("#000000").beginFill(getChoice("Colors")).drawRect(0,0,sidex,sidey);
    		shape.x = start[0];
    		shape.y = start[1];
    	}

		stage.addChild(shape);
		stage.update();
	}
	function shapeOnMouseUp() {
	    canvas.removeEventListener('mousemove', shapeDrawHelper);
	}

	function shapeMouseOver(){
		$(document).mouseup(function() {
			if(typeof shapeDrawHelper == 'function'){
				canvas.removeEventListener('mousemove', shapeDrawHelper);				
			}
		});
	}

	function shapeOnMouseDown(){
		var start = mouse;
	    var shape = new createjs.Shape();
    	canvas.addEventListener('mousemove', shapeDrawHelper = function(){
    		shapeDraw(start,shape);    	
    	});
	}
	function shapeDrawOn(){
		canvas.addEventListener('mousedown', shapeOnMouseDown);
		canvas.addEventListener('mouseup', shapeOnMouseUp);
		canvas.addEventListener('mouseover',shapeMouseOver);
	}

	function shapeDrawOff(){
		canvas.removeEventListener('mousedown', shapeOnMouseDown);
		canvas.removeEventListener('mouseup', shapeOnMouseUp);
		canvas.removeEventListener('mouseover',shapeMouseOver);
	}
	shapeDrawOn();
}


