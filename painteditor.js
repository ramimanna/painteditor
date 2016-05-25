var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var colors = {"Blue":"#1976D2","Purple":"#673AB7","Green":"#009688","Red":"#D32F2F","Orange":"#FF5722","Black":"#000000","White":"#ffffff"}

//Keep Track of mouse position in variable: mouse
var mouse=[0,0];
//Keep Track of whether the shift key is down (only need to do this while mouse is moving)
var shiftDown = false;
//Keep track of these 2 things with a listener when the mouse moves
document.addEventListener('mousemove', function(e) {
  mouse = [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop];
  if(event.shiftKey){
  	shiftDown = true;
  }
  else{
  	shiftDown = false;
  }
});

//While mousedown function: draws a line as the user clicks and moves the mouse
function draw() {
	ctx.lineWidth = 3;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

    ctx.strokeStyle = colors[getChoice("Colors")];
    ctx.lineTo(mouse[0], mouse[1]);
    ctx.stroke();
}

//While DrawOn(), Functions for when mouse is up and down
function drawOnMouseUp() {
    canvas.removeEventListener('mousemove', draw);
}
function drawOnMouseDown() {
    ctx.moveTo(mouse[0], mouse[1]);
    ctx.beginPath();
    canvas.addEventListener('mousemove', draw);
}

//Turns on drawing (freeform)
function drawOn(){
	canvas.addEventListener('mousedown', drawOnMouseDown);
	canvas.addEventListener('mouseup', drawOnMouseUp);
	canvas.addEventListener("mouseout", drawOnMouseUp);
}

//Turns off drawing (freeform)
function drawOff(){
	console.log("drawOff");
	canvas.removeEventListener('mousemove', draw);
	canvas.removeEventListener('mousedown', drawOnMouseDown);
	canvas.removeEventListener('mouseup', drawOnMouseUp);
	canvas.removeEventListener("mouseout", drawOnMouseUp);
}

//Uses drawOff() and drawOn() to toggle freeform
function toggleDraw(){
	if($("#myonoffswitch").prop('checked') == true){
	    drawOn();
	}
	else{
		drawOff();
	}	
}

//Takes in topic ("Colors","Shapes",) and returns the current choice from its respective dropdown menue
function getChoice(topic){
	var choice = document.getElementById(topic)[document.getElementById(topic).selectedIndex].value;
	return choice;
}