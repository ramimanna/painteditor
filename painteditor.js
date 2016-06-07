var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var colors = {"Blue":"#1976D2","Purple":"#673AB7","Green":"#009688","Red":"#D32F2F","Orange":"#FF5722","Black":"#000000","White":"#ffffff"}
var current_tool = null;

//Keep track of these mouse (mouse position) and shiftDown (if shift key is down) with a listener when the mouse moves
var mouse=[0,0];
var shiftDown = false; //this only tracks shift key when mouse is moving
document.addEventListener('mousemove', function(e) {
  mouse = [e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop];
  shiftDown = false;
  if(event.shiftKey){
  	shiftDown = true;
  }
});

var vertical_key = null;
var horizontal_key = null;

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
    	vertical_key = "up";
    }
    else if (e.keyCode == '40') {
        // down arrow
        vertical_key = "down";
    }
    else if (e.keyCode == '37') {
       // left arrow
       horizontal_key = "left";
    }
    else if (e.keyCode == '39') {
       // right arrow
       horizontal_key = "right";
    }
}
document.onkeyup = releaseKeys;
function releaseKeys(e){
    e = e || window.event;
    if(e.keyCode == '38' || e.keyCode == '40'){
    	vertical_key = null;
    }
    if(e.keyCode == '37' || e.keyCode == '39'){
		horizontal_key = null;
    }
}

//Vector Math Helper Functions
function dot(a,b){
  if (a.length != b.length){
    throw "dot of different length vectors";	
  }
  result = 0;
  for(i=0;i<a.length;i++){
    result += a[i]*b[i];	
  }
  return result;
}
function subtract_vec(v1,v2){
  if (v1.length != v2.length){
    throw "subtract_vec of different length vectors";
  }
  result = [];
  for(i=0;i<v1.length;i++){
    result.push(v1[i]-v2[i]);  	
  }
  return result;
}
function magnitude(v1){
	result = 0;
	for(i=0;i<v1.length;i++){
		result+=v1[i]*v1[i];
	}
	return Math.sqrt(result);
}

//Returns selected choice from dropdown lists with topic="Colors","Shapes"
function getChoice(topic){
	return document.getElementById(topic)[document.getElementById(topic).selectedIndex].value;
}

var myEasel = new Easel();
var current_tool = "cursor";
canvas.addEventListener("mousedown",myEasel.mouseDown.bind(myEasel));
canvas.addEventListener("mouseup",myEasel.mouseUp.bind(myEasel));
canvas.addEventListener("mousemove",myEasel.mouseMove.bind(myEasel));
canvas.addEventListener("dblclick",myEasel.doubleClick.bind(myEasel));
document.addEventListener("keydown",myEasel.keyDownOrPress.bind(myEasel));

//Buttons for choosing Tool
$('#imageTool').click(function(){
	myEasel.imageTool();
});

$('#textTool').click(function(){
	myEasel.textTool();
});

$('#cursorTool').click(function(){
	myEasel.cursorTool();
});
$('#shapeDrawFillTool').click(function(){
	myEasel.shapeDrawFillTool();	
});
$('#shapeDrawOutlineTool').click(function(){
  myEasel.shapeDrawOutlineTool();  
});
$('#drawTool').click(function(){
	myEasel.drawTool();	
});