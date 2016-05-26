function Easel(){

	//Configure EaselJS
	console.log("EaselJS at YO SERVICE BROTHA");	
	
	this.stage = new createjs.Stage("myCanvas");
 
 	this.shapes = [];
 	this.current_shape = null;
 
 	this.current_shape_container = null;
 	this.shape_containers = [];
 	//this.current_tool = current_tool;

	//ADD LATER:
	//stage.mouseMoveOutside = true;  	
 	//Easel.createjs.Touch.enable(stage);

	/**************************************************SHAPE DRAW**************************************************/
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
			shape.setBounds(shape.x-diffx,shape.y-diffy,shape.x+diffx,shape.y+diffy);

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
			shape.setBounds(shape.x-radius,shape.y-radius,shape.x+radius,shape.y+radius);

		}  
    	//DRAW RECTANGLE
    	else if(shape_name == "Rectangle"){
			shape.graphics.beginStroke("#000000").beginFill(getChoice("Colors")).drawRect(0,0,diffx,diffy);
			shape.x = start[0];
			shape.y = start[1];
    		shape.setBounds(shape.x,shape.y,diffx,diffy);

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
    		shape.setBounds(shape.x,shape.y,sidex,sidey);
 			container.addChild(shape);
    	}

		this.stage.addChild(shape);
		this.stage.update();
    	
    	this.current_shape = shape;
    	this.current_shape_container = container;		
	}
Easel.prototype.shapeOnMouseUp = function() {
		this.shapes.push(this.current_shape);
		this.shape_containers.push(this.current_shape_container);
	    canvas.removeEventListener('mousemove', shapeDrawHelper);
	}
Easel.prototype.shapeMouseOver = function(){
		$(document).mouseup(function() {
			if(typeof shapeDrawHelper == 'function'){
				canvas.removeEventListener('mousemove', shapeDrawHelper);				
			}
		});
	}
Easel.prototype.shapeOnMouseDown = function(){
		var start = mouse;
	    var shape = new createjs.Shape();
    	var container = new createjs.Container();
    	var Easelthis = this;

    	canvas.addEventListener('mousemove', shapeDrawHelper = function(){
    		Easelthis.shapeDraw(start,shape,container);    	
    	});
	}
// Easel.prototype.dragOnHelper = function(evt) {

// 	    this.bounds = my_shape.getTransformedBounds();	    
// 	    evt.target.x = evt.stageX;
// 	    evt.target.y = evt.stageY;
// 	    this.stage.update();
// 	}

// Easel.prototype.dragOn = function(){
// 		console.log("this.shapes, this.shape_containers",this.shapes, this.shape_containers);
// 		for (i = 0; i < this.shapes.length; i++){
// 			my_shape = this.shapes[i];
// 			my_container = this.shape_containers[i];
// 			this.dragOnHelper = this.dragOnHelper.bind(this);
// 			my_shape.on("pressmove",this.dragOnHelper);
// 		}

// 	}
// Easel.prototype.dragOff = function(){
// 		console.log("this.shapes, this.shape_containers",this.shapes, this.shape_containers);
// 		for (i = 0; i < this.shapes.length; i++){
// 			my_shape = this.shapes[i];
// 			my_container = this.shape_containers[i];
// 			my_shape.off("pressmove", this.dragOnHelper);
// 		}
// 	}
Easel.prototype.shapeDrawOn = function(){
		this.shapeOnMouseDown = this.shapeOnMouseDown.bind(this);
		this.shapeOnMouseUp = this.shapeOnMouseUp.bind(this);
		this.shapeOnMouseOver = this.shapeMouseOver.bind(this);

		canvas.addEventListener('mousedown', this.shapeOnMouseDown);
		canvas.addEventListener('mouseup', this.shapeOnMouseUp);
		canvas.addEventListener('mouseover',this.shapeMouseOver);
    	current_tool = "shapeDraw";
		// this.dragOff();
	}
Easel.prototype.shapeDrawOff = function(){
		console.log("reached shapeDrawOff");
		canvas.removeEventListener('mousedown', this.shapeOnMouseDown);
		canvas.removeEventListener('mouseup', this.shapeOnMouseUp);
		canvas.removeEventListener('mouseover',this.shapeMouseOver);
    	current_tool = null;
    	console.log("this in this.dragOn() call:", this);
		// this.dragOn();
	}


