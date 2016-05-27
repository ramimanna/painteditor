function Easel(){

	//Configure EaselJS
	console.log("EaselJS at YO SERVICE BROTHA");	
	
	this.stage = new createjs.Stage("myCanvas");
 
 	this.shapes = [];
 	this.current_shape = null;
 
 	this.current_shape_container = null;
 	this.shape_containers = [];
 	this.mouseIsDown = false;
 	//this.current_tool = current_tool;

	//ADD LATER:
	//stage.mouseMoveOutside = true;  	
 	//Easel.createjs.Touch.enable(stage);

	/**************************************************SHAPE DRAW**************************************************/
}

Easel.prototype.lineDraw = function(s,t,shape,color="#eeeeee"){
		shape.graphics.setStrokeStyle(3).beginStroke(color).moveTo(s[0], s[1]).lineTo(t[0], t[1]).endStroke();
		this.stage.addChild(shape);		
		this.stage.update();
		return shape;		
}
//While mousedown function: draws a shape
Easel.prototype.shapeDraw = function(start,shape,container) {

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

			if(shiftDown && shape_name == "Line"){
				shape_name = "StrictLine";
			}
			else if(!shiftDown && shape_name == "StrictLine"){
				shape_name = "Line";
			}

		//clear last update of shape
		shape.graphics.clear();

		//mouse x and y distances from start point
    	var diffx = mouse[0]-start[0];
    	var diffy = mouse[1]-start[1];
    	//DRAW ALL SHAPES
			//Draw Line
			if(shape_name == "Line"){
				this.lineDraw(start,mouse,shape);
			}
			//Draw Straight Line that snaps to 90degs
			if(shape_name == "StrictLine"){
				//Draw line at 90 degrees
				if(Math.abs(diffy)>Math.abs(diffx)){
					this.lineDraw(start,[start[0],mouse[1]],shape,getChoice("Colors"));
				}
				else if(Math.abs(diffy)<Math.abs(diffx)){
					this.lineDraw(start,[mouse[0],start[1]],shape,getChoice("Colors"));
				}
				//DIAGONAL: NOT WORKING FOR ALL SIDES
				// if(Math.abs(Math.abs(diffy)-Math.abs(diffx))<=20){
				// 	shape.graphics.lineTo(start[0]+(diffx+diffy)/2.0,start[1]+(diffx+diffy)/2.0);
				// }
				shape.graphics.endStroke();
			}
	    	//Draw Oval
	    	if(shape_name == "Oval"){
				shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawEllipse(0,0,diffx,diffy);
				shape.x = start[0];
				shape.y = start[1];   
				shape.setBounds(shape.x-diffx,shape.y-diffy,shape.x+diffx,shape.y+diffy);

	    	}
	    	//Draw Circle:
	    	if(shape_name == "Circle"){
		    	var radius = Math.max(Math.abs(diffx),Math.abs(diffy))/2.0;			
				shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawCircle(0, 0, radius);

				//Allows drawing shapes in all directions
				shape.x = start[0]+radius;
				shape.y = start[1]+radius;
				
				if(diffx<0){
					shape.x = shape.x-2*radius; 
				}
				if(diffy<0){
					shape.y = shape.y-2*radius;
				}
				shape.setBounds(shape.x-radius,shape.y-radius,shape.x+radius,shape.y+radius);

			}  
	    	//Draw Rectangle
	    	else if(shape_name == "Rectangle"){
				shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawRect(0,0,diffx,diffy);
				shape.x = start[0];
				shape.y = start[1];
	    		shape.setBounds(shape.x,shape.y,diffx,diffy);

	    	}
	    	//Draw Square
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
	    		shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawRect(0,0,sidex,sidey);
	    		shape.x = start[0];
	    		shape.y = start[1];
	    		shape.setBounds(shape.x,shape.y,sidex,sidey);
	 			container.addChild(shape);
	    	}

    	this.current_shape = shape;
    	this.current_shape_container = container;
		shape.selection_lines = [];

		this.stage.addChild(shape);
		this.stage.update();
}
Easel.prototype.dragOn = function(evt){
	   	if(mouse != this.start){
	   		//Move to next location
		   	this.selected_shape.x = this.selected_shape_start[0] + mouse[0] - this.start[0]; //REPLACE MOUSE WITH MORE ACCURATE VERSION?
		    this.selected_shape.y = this.selected_shape_start[1] + mouse[1] - this.start[1];
		    //Bring to front
			this.stage.setChildIndex(this.selected_shape, this.stage.getNumChildren()-1);
		    if(this.mouseIsDown){
		    	this.select();
		    }
		    //Render Graphics
		    this.stage.update();
		}
}

Easel.prototype.select = function(){
	//clear last update of shape
	this.deselect();

	this.selected_shape.bounds = this.selected_shape.getBounds();
	left_x = this.selected_shape.x;
	right_x = this.selected_shape.x + this.selected_shape.bounds.width;
	top_y = this.selected_shape.y;
	bottom_y = this.selected_shape.y + this.selected_shape.bounds.height;
	points = [[left_x,top_y],[right_x,top_y],[right_x,bottom_y],[left_x,bottom_y]];
	//console.log(points);
	for (i = 0; i < 4; i++) {
		console.log(i,i+1);
		line = this.lineDraw(points[i%4],points[(i+1)%4],this.shape);
		this.selected_shape.selection_lines.push(line);
	}
	this.stage.update();
}

Easel.prototype.deselect = function(){
	//clear last update of shape
	for(i = 0; i < this.selected_shape.selection_lines.length; i++){
		line = this.selected_shape.selection_lines[i];
		console.log("line",line);
	 	line.graphics.clear();
	}
	this.stage.update();
	this.selected_shape.selection_lines=[];
}
//MOUSE CONTROLS:
Easel.prototype.mouseDown = function(){
    this.mouseIsDown = true;
	this.start = mouse;
	if(current_tool=="shapeDraw"){
	    this.shape = new createjs.Shape();
    	this.container = new createjs.Container();
	}

	else if(current_tool=="cursor"){
		//If another shape is selected, deselect it
		if(this.selected_shape){
			this.deselect();
		}
		//set the new shape to select
		this.selected_shape = this.stage.getObjectUnderPoint(mouse[0],mouse[1]);
		//if it is a shape and not null:
		if(this.selected_shape){
			//SELECT THE SELECTED SHAPE!
			this.shape = new createjs.Shape();
			this.select();
			this.start = mouse;
			this.selected_shape_start = [this.selected_shape.x,this.selected_shape.y];
		}
	}
}

Easel.prototype.mouseUp = function(){
	this.mouseIsDown = false;
	if(current_tool == "shapeDraw"){
		this.shapes.push(this.current_shape);
		this.shape_containers.push(this.current_shape_container);
	}
}
Easel.prototype.mouseMove = function(evt){
	if(current_tool=="shapeDraw"){
		if (this.mouseIsDown){
			this.shapeDraw(this.start,this.shape,this.container);
		}
	}
	else if(current_tool=="cursor"){
		if(this.selected_shape && this.mouseIsDown){
				this.dragOn(evt);
		}
	}
}

//TOOL TOGGLE FUNCTIONS:
Easel.prototype.cursorTool = function(){
	current_tool = "cursor";
	console.log(current_tool);
}
Easel.prototype.shapeDrawTool = function(){
	current_tool = "shapeDraw";
	console.log(current_tool);
}