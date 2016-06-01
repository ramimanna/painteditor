function Easel(){

	//Configure EaselJS
	console.log("EaselJS at YO SERVICE BROTHA");	
	
	this.stage = new createjs.Stage("myCanvas");
 
 	this.shapes = [];
 	this.current_shape = null;
 
 	this.current_shape_container = null;
 	this.shape_containers = [];
 	this.mouseIsDown = false;

	//ADD LATER:
	//stage.mouseMoveOutside = true;  	
 	//Easel.createjs.Touch.enable(stage);
}

Easel.prototype.lineDraw = function(s,t,shape, color){
		shape.graphics.setStrokeStyle(1).beginStroke(color).moveTo(s[0], s[1]).lineTo(t[0], t[1]).endStroke();		
		this.stage.addChild(shape);		
		//Bring to front
		//this.stage.setChildIndex(shape, this.stage.getNumChildren()-1);

		this.stage.update();
		return shape;		
}
//While mousedown function: draws a shape
Easel.prototype.shapeDraw = function(start,shape) {

		//Get shape choice and modify according to whether ShiftKey is down.
		shape.shape_name = getChoice("Shapes");
			if(shiftDown && shape.shape_name=="Rectangle"){
				shape.shape_name = "Square";
			}
			else if(!shiftDown && shape.shape_name=="Square"){
				shape.shape_name = "Rectangle";
			}
			
			if(shiftDown && shape.shape_name == "Oval"){
				shape.shape_name = "Circle";
			}
			else if(!shiftDown && shape.shape_name == "Circle"){
				shape.shape_name = "Oval";
			}

			if(shiftDown && shape.shape_name == "Line"){
				shape.shape_name = "StrictLine";
			}
			else if(!shiftDown && shape.shape_name == "StrictLine"){
				shape.shape_name = "Line";
			}

		//clear last update of shape
		shape.graphics.clear();

		//mouse x and y distances from start point
    	shape.diffx = mouse[0]-start[0];
    	shape.diffy = mouse[1]-start[1];
    	//DRAW ALL SHAPES
			//Draw Line
			if(shape.shape_name == "Line"){
				this.lineDraw(start,mouse,shape,getChoice("Colors"));
			}
			//Draw Straight Line that snaps to 90degs
			if(shape.shape_name == "StrictLine"){
				//Draw line at 90 degrees
				if(Math.abs(shape.diffy)>Math.abs(shape.diffx)){
					this.lineDraw(start,[start[0],mouse[1]],shape,getChoice("Colors"));
				}
				else if(Math.abs(shape.diffy)<Math.abs(shape.diffx)){
					this.lineDraw(start,[mouse[0],start[1]],shape,getChoice("Colors"));
				}
				//DIAGONAL: NOT WORKING FOR ALL SIDES
				// if(Math.abs(Math.abs(shape.diffy)-Math.abs(shape.diffx))<=20){
				// 	shape.graphics.lineTo(start[0]+(shape.diffx+shape.diffy)/2.0,start[1]+(shape.diffx+shape.diffy)/2.0);
				// }
				shape.graphics.endStroke();
			}
	    	//Draw Oval
	    	if(shape.shape_name == "Oval"){
				shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawEllipse(0,0,shape.diffx,shape.diffy);
				shape.xradius = Math.abs(shape.diffx)/2.0;
				shape.yradius = Math.abs(shape.diffy)/2.0;

				shape.x = start[0];
				shape.y = start[1];

				shape.midpoint = [shape.x+shape.xradius,shape.y+shape.yradius]
				shape.setBounds(shape.x-shape.diffx,shape.y-shape.diffy,shape.x+shape.diffx,shape.y+shape.diffy);

	    	}
	    	//Draw Circle:
	    	if(shape.shape_name == "Circle"){
		    	shape.radius = Math.max(Math.abs(shape.diffx),Math.abs(shape.diffy))/2.0;			
				shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawCircle(0, 0, shape.radius);

				//Allows drawing shapes in all directions
				shape.x = start[0]+shape.radius;
				shape.y = start[1]+shape.radius;

				shape.midpoint = [shape.x,shape.y]		

				if(shape.diffx<0){
					shape.x = shape.x-2*shape.radius; 
				}
				if(shape.diffy<0){
					shape.y = shape.y-2*shape.radius;
				}
				shape.setBounds(shape.x-shape.radius,shape.y-shape.radius,shape.x+shape.radius,shape.y+shape.radius);

			}  
	    	//Draw Rectangle
	    	else if(shape.shape_name == "Rectangle"){
				shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawRect(0,0,shape.diffx,shape.diffy);
				shape.x = start[0];
				shape.y = start[1];

				shape.midpoint = [shape.x + shape.diffx/2, shape.y + shape.diffy/2]
	    		shape.setBounds(shape.x,shape.y,shape.diffx,shape.diffy);

	    	}
	    	//Draw Square
	    	else if(shape.shape_name == "Square"){
	    		if (Math.abs(shape.diffx)>=Math.abs(shape.diffy)){
	   				shape.sidex = Math.abs(shape.diffx);
	   				shape.sidey = Math.abs(shape.diffx);
	    		}
	    		else{
	    			shape.sidex = Math.abs(shape.diffy);
	    			shape.sidey = Math.abs(shape.diffy);
	    		}
	    		if (shape.diffx < 0){
	    			shape.sidex = -shape.sidex;
	    		}
	    		if (shape.diffy < 0){
	    			shape.sidey = -shape.sidey;
	    		}
	    		shape.graphics/*.beginStroke("#eeeeee")*/.beginFill(getChoice("Colors")).drawRect(0,0,shape.sidex,shape.sidey);
	    		shape.x = start[0];
	    		shape.y = start[1];
	    		console.log("shape.x,shape.y",shape.x,shape.y);
	    		console.log("shape.width,shape.height",shape.width,shape.height);
	    		console.log("shape.sidex,shape.sidey",shape.sidex,shape.sidey);
	    		shape.setBounds(shape.x,shape.y,shape.sidex,shape.sidey);
	 			//container.addChild(shape);
	    	}
	    //Add Shadow	
		//shape.shadow = new createjs.Shadow('#000', 4, 4, 5);
    	this.current_shape = shape;
    	//this.current_shape_container = container;
		shape.selection_lines = [];

		this.stage.addChild(shape);
		this.stage.update();
}

Easel.prototype.rotate = function(start){
	//Calculate delta-angle of mouse from midpoint, from dot product of vectors: (center->start) DOT (center->mouse)
	//this.selected_shape.rotation++;
	v1 = subtract_vec(start,this.selected_shape.midpoint);
	v2 = subtract_vec(mouse,this.selected_shape.midpoint);
	angle = dot(v1,v2)/(magnitude(v1)*magnitude(v2));

	this.stage.update;
}

Easel.prototype.resize = function(){

}

Easel.prototype.dragOn = function(){
	   	if(mouse != this.start){
	   		x_change = mouse[0] - this.start[0];
	   		y_change = mouse[1] - this.start[1];
	   		//Move to next location
		   	this.selected_shape.x = this.selected_shape_start[0] + x_change;
		    this.selected_shape.y = this.selected_shape_start[1] + y_change;
		    // this.selected_shape.midpoint = [this.selected_shape.midpoint[0]+x_change,this.selected_shape.midpoint[1]+y_change];
		 //    //Bring to front
			// this.stage.setChildIndex(this.selected_shape, this.stage.getNumChildren()-1);
		    if(this.mouseIsDown){
		    	this.select();
		    }
		    //Render Graphics
		    this.stage.update();
		}
}

Easel.prototype.budge = function(vertical,horizontal){
	//Calculate change
	x_change = 0;
	y_change = 0;
	console.log("vertical,horizontal",vertical,horizontal);
	if(vertical == "up"){
		y_change = -2;
	}
	else if (vertical == "down"){
		y_change = 2;
	}
	if(horizontal == "right"){
		x_change = 2;
	}
	else if(horizontal == "left"){
		x_change = -2;
	}
	//Move to next location
	this.selected_shape.x += x_change;
	this.selected_shape.y += y_change;
	
	//Keep selected
	this.select();
	//Render Graphics
	this.stage.update();	
}

Easel.prototype.select = function(){
	//clear last update of shape
	this.deselect();

	this.selected_shape.bounds = this.selected_shape.getBounds();
	if(this.selected_shape.shape_name == "Rectangle" || this.selected_shape.shape_name == "Square"){
		left_x = this.selected_shape.x;
		right_x = this.selected_shape.x + this.selected_shape.bounds.width;
		top_y = this.selected_shape.y;
		bottom_y = this.selected_shape.y + this.selected_shape.bounds.height;
		this.selected_shape.midpoint = [this.selected_shape.x + this.selected_shape.diffx/2, this.selected_shape.y + this.selected_shape.diffy/2];
		if (this.selected_shape.shape_name == "Square"){
			this.selected_shape.midpoint = [this.selected_shape.x + this.selected_shape.sidex/2, this.selected_shape.y + this.selected_shape.sidey/2];
		}
	}
	else if(this.selected_shape.shape_name == "Circle"){
		left_x = this.selected_shape.x-this.selected_shape.radius;
		right_x = this.selected_shape.x + this.selected_shape.radius;
		top_y = this.selected_shape.y-this.selected_shape.radius;
		bottom_y = this.selected_shape.y + this.selected_shape.radius;
		this.selected_shape.midpoint = [this.selected_shape.x,this.selected_shape.y];

	}
	else if(this.selected_shape.shape_name == "Oval"){
		left_x = this.selected_shape.x;
		right_x = this.selected_shape.x + 2*this.selected_shape.xradius;
		top_y = this.selected_shape.y;
		bottom_y = this.selected_shape.y + 2*this.selected_shape.yradius;
		this.selected_shape.midpoint = [this.selected_shape.x+this.selected_shape.xradius,this.selected_shape.y+this.selected_shape.yradius];		
	}
	left_x -=.5
	right_x +=.5
	top_y -=.5
	bottom_y +=.5



	points = [[left_x,top_y],[right_x,top_y],[right_x,bottom_y],[left_x,bottom_y]];
	side_mids = [[this.selected_shape.midpoint[0],top_y],[this.selected_shape.midpoint[0],bottom_y],[left_x,this.selected_shape.midpoint[1]],[right_x,this.selected_shape.midpoint[1]]];
	for (i = 0; i < 4; i++) {
		//DRAW LINES:
		line = this.lineDraw(points[i%4],points[(i+1)%4],this.shape,"#000000");
		this.selected_shape.selection_lines.push(line);
	}
	for(i=0; i <4; i++){
		//DRAW SIDE CIRCLES:
		side_circle = new createjs.Shape();
		side_circle.radius = 3.5;
		side_circle.graphics.setStrokeStyle(1).beginStroke("#000000").beginFill("#ffffff").drawCircle(0, 0, side_circle.radius);

		//put in each corner
		side_circle.x = side_mids[i][0];
		side_circle.y = side_mids[i][1];
		this.selected_shape.side_circles.push(side_circle);
		this.stage.addChild(side_circle);

		//DRAW CORNER CIRCLES:
		corner_circle = new createjs.Shape();
		corner_circle.radius = 3.5;
		corner_circle.graphics.setStrokeStyle(1).beginStroke("#000000").beginFill("#ffffff").drawCircle(0, 0, corner_circle.radius);

		//put in each corner
		corner_circle.x = points[i][0];
		corner_circle.y = points[i][1];
		this.selected_shape.corner_circles.push(corner_circle);
		this.stage.addChild(corner_circle);
	}

	this.stage.update();
}

Easel.prototype.deselect = function(){
	//clear last update of shape
	for(i = 0; i < this.selected_shape.selection_lines.length; i++){
		line = this.selected_shape.selection_lines[i];
	 	line.graphics.clear();
	 	side_circle = this.selected_shape.side_circles[i];
	 	side_circle.graphics.clear();
	 	corner_circle = this.selected_shape.corner_circles[i];
	 	corner_circle.graphics.clear();
	}

	this.stage.update();
	this.selected_shape.selection_lines=[];
	this.selected_shape.corner_circles = [];
	this.selected_shape.side_circles = [];
}

//While mousedown function: draws a line as the user clicks and moves the mouse
Easel.prototype.draw = function(start,shape) {
	this.lineDraw(start,mouse,shape,getChoice("Colors"));
}

//MOUSE CONTROLS:
Easel.prototype.mouseDown = function(){
    this.mouseIsDown = true;
	this.start = mouse;
	if(current_tool=="shapeDraw"){
	    this.shape = new createjs.Shape();
    	//this.container = new createjs.Container();
	}
	else if(current_tool == "draw"){
		this.shape = new createjs.Shape();
		//this.shape.graphics.setStrokeStyle(3, "round").moveTo(this.start[0],this.start[1]);
	}

	else if(current_tool=="cursor"){
		//If another shape is selected, deselect it
		this.prev_selected_shape = this.selected_shape;
		if(this.selected_shape){
			this.deselect();
		}
		//set the new shape to select
		this.selected_shape = this.stage.getObjectUnderPoint(mouse[0],mouse[1]);
		//console.log(this.prev_selected_shape,($.inArray(this.prev_selected_shape,this.shapes)!= -1));
		
		// if(this.prev_selected_shape && !this.selected_shape && ($.inArray(this.prev_selected_shape,this.shapes)!= -1)){
		// 	this.selected_shape = this.prev_selected_shape;
		// 	this.select();
		// 	console.log("YASS!");
		// 	console.log("selected:",this.selected_shape);
		// }

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
		//this.shape_containers.push(this.current_shape_container);
	}
}
Easel.prototype.mouseMove = function(evt){
	if(current_tool=="shapeDraw"){
		if (this.mouseIsDown){
			this.shapeDraw(this.start,this.shape);//,this.container);
		}
	}

	if(current_tool == "draw"){
		if (this.mouseIsDown){
			this.draw(this.start, this.shape);
			this.start = mouse;
		}
	}
	else if(current_tool=="cursor"){
		if(this.selected_shape && this.mouseIsDown){
				this.dragOn();
		}

	}
}

Easel.prototype.doubleClick = function(){
    //Bring to front
	this.stage.setChildIndex(this.selected_shape, this.stage.getNumChildren()-1);
	this.stage.update();
}

Easel.prototype.arrowKeys = function(){
	console.log("this",this);
	console.log(this.selected_shape);
	if(this.selected_shape){
		console.log("bout to budge!");
		this.budge(vertical_key, horizontal_key);
	}
}

//TOOL TOGGLE FUNCTIONS:
Easel.prototype.cursorTool = function(){
	current_tool = "cursor";
	console.log(current_tool);
}

Easel.prototype.drawTool = function(){
	current_tool = "draw";
	console.log(current_tool);
}

Easel.prototype.shapeDrawTool = function(){
	current_tool = "shapeDraw";
	console.log(current_tool);
}