/*
Javasript to handle mouse dragging and release
to drag a string around the html canvas
Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM element is just the canvas on which
where are drawing and a text field and button where the user can type data

This example shows examples of using JQuery
JQuery is a popular helper library the has useful methods,
especially for sendings asynchronous requests to the server
and catching the response.

See the W3 Schools website to learn basic JQuery
JQuery syntax:
$(selector).action();
e.g.
$(this).hide() - hides the current element.
$("p").hide() - hides all <p> elements.
$(".test").hide() - hides all elements with class="test".
$("#test").hide() - hides the element with id="test".

Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

//Use javascript array of objects to represent words and their locations
var words = [];
// words.push({word: "", x:50, y:50});
// words.push({word: "", x:70, y:50});
// words.push({word: "the", x:120, y:50});
// words.push({word: "way", x:170, y:50});
// words.push({word: "your", x:230, y:50});
// words.push({word: "sparkling", x:300, y:50});
// words.push({word: "earrings", x:430, y:50});
// words.push({word: "lay", x:540, y:50});

var movingString = {word: "",
                    x: 0,
					y:0,
					xDirection: 0, //+1 for leftwards, -1 for rightwards
					yDirection: -10, //+1 for downwards, -1 for upwards
					stringWidth: 0, //will be updated when drawn
					stringHeight: 0}; //assumed height based on drawing point size

//indended for keyboard control
// var movingBox = {x: 50,
//                  y: 50,
// 				 width: 100,
// 				 height: 100};

var wayPoints = []; //locations where the moving box has been

var timer;

var wordBeingMoved;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY){

	  //locate the word near aCanvasX,aCanvasY
      var context = canvas.getContext('2d');

	  //Just use crude region for now.
	  //should be improved to using lenght of word etc.

	  //note you will have to click near the start of the word
	  //as it is implemented now
	  for(var i=0; i<words.length; i++){
          var x = words[i].word.length;
		 if(Math.abs(words[i].x - aCanvasX) <20*x  &&
		    Math.abs(words[i].y - aCanvasY) < 20) return words[i];
	  }
	  return null;
    }

var drawCanvas = function(){

    var context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

    context.font = '20pt Arial';
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

    for(var i=0; i<words.length; i++){  //note i declared as var

			var data = words[i];
			context.fillText(data.word, data.x, data.y);
            context.strokeText(data.word, data.x, data.y);

	}

    movingString.stringWidth = context.measureText(	movingString.word).width;
	//console.log(movingString.stringWidth);
    //context.fillText(movingString.word, movingString.x, movingString.y);

    //draw moving box
	// context.fillRect(movingBox.x,
	//                  movingBox.y,
	// 				 movingBox.width,
	// 				 movingBox.height);

	//draw moving box way points
	for(i in wayPoints){
		context.strokeRect(wayPoints[i].x,
		             wayPoints[i].y,
					 movingBox.width,
					 movingBox.height);
	}
	//draw circle
//     context.beginPath();
//     context.arc(canvas.width/2, //x co-ord
//             canvas.height/2, //y co-ord
// 			canvas.height/2 - 5, //radius
// 			0, //start angle
// 			2*Math.PI //end angle
// 			);
//     context.stroke();
    }

function handleMouseDown(e){

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
    //var canvasX = e.clientX - rect.left;
    //var canvasY = e.clientY - rect.top;
    var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
    var canvasY = e.pageY - rect.top;
	console.log("mouse down:" + canvasX + ", " + canvasY);

	wordBeingMoved = getWordAtLocation(canvasX, canvasY);
	//console.log(wordBeingMoved.word);
	if(wordBeingMoved != null ){
	   deltaX = wordBeingMoved.x - canvasX;
	   deltaY = wordBeingMoved.y - canvasY;
	   //document.addEventListener("mousemove", handleMouseMove, true);
       //document.addEventListener("mouseup", handleMouseUp, true);
	$("#canvas1").mousemove(handleMouseMove);
	$("#canvas1").mouseup(handleMouseUp);

	}

    // Stop propagation of the event and stop any default
    //  browser action

    e.stopPropagation();
    e.preventDefault();

	drawCanvas();
	}

function handleMouseMove(e){

	console.log("mouse move");

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
    var canvasX = e.pageX - rect.left;
    var canvasY = e.pageY - rect.top;

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;

	e.stopPropagation();

	drawCanvas();
	}

function handleMouseUp(e){
	console.log("mouse up");

	e.stopPropagation();

    //$("#canvas1").off(); //remove all event handlers from canvas
    //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

	//remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

	drawCanvas(); //redraw the canvas
	}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer(){
	// movingString.x = (movingString.x + 5*movingString.xDirection);
	// movingString.y = (movingString.y + 5*movingString.yDirection);
    //
	// //keep inbounds of canvas
	// if(movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1;
	// if(movingString.x < 0) movingString.xDirection = 1;
	// if(movingString.y > canvas.height) movingString.yDirection = -1;
	// if(movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1;

	drawCanvas()
}

    //KEY CODES
	//should clean up these hard coded key codes
	var ENTER = 13;
	var RIGHT_ARROW = 39;
	var LEFT_ARROW = 37;
	var UP_ARROW = 38;
	var DOWN_ARROW = 40;


function handleKeyDown(e){

	console.log("keydown code = " + e.which );

	var dXY = 5; //amount to move in both X and Y direction
	if(e.which == UP_ARROW && movingBox.y >= dXY)
	   movingBox.y -= dXY;  //up arrow
	if(e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
	   movingBox.x += dXY;  //right arrow
	if(e.which == LEFT_ARROW && movingBox.x >= dXY)
	   movingBox.x -= dXY;  //left arrow
	if(e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
	   movingBox.y += dXY;  //down arrow

    var keyCode = e.which;
    if(keyCode == UP_ARROW | keyCode == DOWN_ARROW){
       //prevent browser from using these with text input drop downs
       e.stopPropagation();
       e.preventDefault();
	}

}

function handleKeyUp(e){
	console.log("key UP: " + e.which);
	if(e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW){
	var dataObj = {x: movingBox.x, y: movingBox.y};
	//create a JSON string representation of the data object
	var jsonString = JSON.stringify(dataObj);


	$.post("positionData", jsonString, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var wayPoint = JSON.parse(data);
			wayPoints.push(wayPoint);
			for(i in wayPoints) console.log(wayPoints[i]);
			});
	}

	if(e.which == ENTER){
	   handleSubmitButton(); //treat ENTER key like you would a submit
	   $('#userTextField').val(''); //clear the user text field
	}

	e.stopPropagation();
    e.preventDefault();


}

function handleSubmitButton () {

    var userText = $('#userTextField').val(); //get text from user text input field
	if(userText && userText != ''){
	   //user text was not empty
       let textDiv= document.getElementById("text-area");
       //textDiv.innerHTML = textDiv.innerHTML +`<p> ${userText},</p>`

       //textDiv.innerHTML=textDiv.innerHTML+`<p> ${returnObj.wordArray[i]};</p>`


	   var userRequestObj = {text: userText}; //make object to send to server
       var userRequestJSON = JSON.stringify(userRequestObj); //make json string
	   $('#userTextField').val(''); //clear the user text field

	   //Prepare a POST message for the server and a call back function
	   //to catch the server repsonse.
       //alert ("You typed: " + userText);
	   $.post("userText", userRequestJSON, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var responseObj = JSON.parse(data);
			movingString.word = responseObj.text;
			//replace word array with new words if there are any
			if(responseObj.wordArray) words = responseObj.wordArray;
            for (var i =0;i<responseObj.textArray.length;i++){
            textDiv.innerHTML = textDiv.innerHTML += "<p>" + responseObj.textArray[i] + "</p>";
        }
			});
	}

}


$(document).ready(function(){
	//This is called after the broswer has loaded the web page

	//add mouse down listener to our canvas object
	$("#canvas1").mousedown(handleMouseDown);

	//add key handler for the document as a whole, not separate elements.
	$(document).keydown(handleKeyDown);
	$(document).keyup(handleKeyUp);

	timer = setInterval(handleTimer, 100);
    //timer.clearInterval(); //to stop

	drawCanvas();
});
