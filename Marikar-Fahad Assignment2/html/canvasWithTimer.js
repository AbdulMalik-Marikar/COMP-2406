/*
Client-side javascript for 2406 assignment 1
(c) Louis D. Nel 2018
*/



var words = []; //array of drag-able lyrics and chords

//leave this moving word for fun and for using it to
//provide status info to client.
//NOT part of assignment requirements
var movingString = {word: "Moving",
                    x: 100,
					y:100,
					xDirection: 1, //+1 for leftwards, -1 for rightwards
					yDirection: 1, //+1 for downwards, -1 for upwards
					stringWidth: 50, //will be updated when drawn
					stringHeight: 24}; //assumed height based on drawing point size


var timer; //timer for animation of moving string etc.
var wordBeingMoved; //word being dragged by the mouse
var deltaX, deltaY; //location where mouse is pressed relative to word origin
var canvas = document.getElementById('canvas1'); //our drawing canvas
var fontPointSize = 18; //point size for chord and lyric text
var wordHeight = 20; //estimated height of a string in the editor
var editorFont = 'Courier New'; //font for your editor -must be monospace font
var lineHeight = 40; //nominal height of text line
var lyricLineOffset = lineHeight*5/8; //nominal offset for lyric line below chords
var topMargin = 40; //hard coded top margin white space of page
var leftMargin = 40; //hard code left margin white space of page

var wordTargetRect = {x: 0, y:0, width: 0, height: 0}; //used for debugging
                                                       //rectangle around word boundary


function getWordAtLocation(aCanvasX, aCanvasY){

	  //locate the word near aCanvasX,aCanvasY co-ordinates
	  //aCanvasX and aCanvasY are assumed to be X,Y loc
	  //relative to upper left origin of canvas

	  //used to get the word mouse is clicked on

	  var context = canvas.getContext('2d');

	  for(var i=0; i<words.length; i++){
	     var wordWidth = context.measureText(words[i].word).width;
		 if((aCanvasX > words[i].x && aCanvasX < (words[i].x + wordWidth))  &&
			    (aCanvasY > words[i].y - wordHeight && aCanvasY < words[i].y)) {
			//set word targeting rectangle for debugging
			wordTargetRect = {x: words[i].x, y: words[i].y-wordHeight, width: wordWidth, height : wordHeight};
			return words[i];} //return the word found
	  }
	  return null; //no word found at location
    }

function drawCanvas(){

    var context = canvas.getContext('2d');
	var lyricFillColor = 'cornflowerblue';
	var lyricStrokeColor = 'blue';
	var chordFillColor = 'green';
	var chordStrokeColor = 'green';

    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

    context.font = '' + fontPointSize + 'pt ' + editorFont;
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

	//draw drag-able lyric and chord words
    for(var i=0; i<words.length; i++){
			var data = words[i];
			if(data.lyric){
			    context.fillStyle = lyricFillColor;
				context.strokeStyle = lyricStrokeColor;
			}
			if(data.chord){
			    context.fillStyle = chordFillColor;
				context.strokeStyle = chordStrokeColor;
			}
			context.fillText(data.word, data.x, data.y);
            context.strokeText(data.word, data.x, data.y);
	}

	//draw box around word last targeted with mouse -for debugging
	//context.strokeRect(wordTargetRect.x, wordTargetRect.y, wordTargetRect.width, wordTargetRect.height);

	/*
    context.fillStyle = 'red';
    movingString.stringWidth = context.measureText(	movingString.word).width;
    context.fillText(movingString.word, movingString.x, movingString.y);
	*/


}

function getCanvasMouseLocation(e){
   //provide the mouse location relative to the upper left corner
   //of the canvas

   /*
   This code took some trial and error. If someone wants to write a
   nice tutorial on how mouse-locations work that would be great.
   */
	var rect = canvas.getBoundingClientRect();

	//account for amount the document scroll bars might be scrolled
	var scrollOffsetX = $(document).scrollLeft();
	var scrollOffsetY = $(document).scrollTop();

    var canX = e.pageX - rect.left -scrollOffsetX;
    var canY = e.pageY - rect.top -scrollOffsetY;

	return {canvasX: canX, canvasY: canY};

}

function handleMouseDown(e){

	var canvasMouseLoc = getCanvasMouseLocation(e);
	var canvasX = canvasMouseLoc.canvasX;
	var canvasY = canvasMouseLoc.canvasY;
	console.log("mouse down:" + canvasX + ", " + canvasY);

	wordBeingMoved = getWordAtLocation(canvasX, canvasY);
	//console.log(wordBeingMoved.word);
	if(wordBeingMoved != null ){
	   deltaX = wordBeingMoved.x - canvasX;
	   deltaY = wordBeingMoved.y - canvasY;
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

	//console.log("mouse move");

	var canvasMouseLoc = getCanvasMouseLocation(e);
	var canvasX = canvasMouseLoc.canvasX;
	var canvasY = canvasMouseLoc.canvasY;

	console.log("move: " + canvasX + "," + canvasY);

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;

	e.stopPropagation();

	drawCanvas();
	}

function handleMouseUp(e){
	//console.log("mouse up");
	e.stopPropagation();

	//remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

	drawCanvas(); //redraw the canvas
	}


function handleTimer(){
	movingString.x = (movingString.x + 5*movingString.xDirection);
	movingString.y = (movingString.y + 5*movingString.yDirection);

	//keep moving string within canvas bounds
	if(movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1;
	if(movingString.x < 0) movingString.xDirection = 1;
	if(movingString.y > canvas.height) movingString.yDirection = -1;
	if(movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1;

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

	//console.log("keydown code = " + e.which );
    var keyCode = e.which;
    if(keyCode == UP_ARROW | keyCode == DOWN_ARROW){
       //prevent browser from using these with text input drop downs
       e.stopPropagation();
       e.preventDefault();
	}

}

function handleKeyUp(e){
	//console.log("key UP: " + e.which);
	if(e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW){
         //do nothing for now
	}

	if(e.which == ENTER){
	   handleSubmitButton(); //treat ENTER key like you would a submit
	   $('#userTextField').val(''); //clear the user text field
	}

	e.stopPropagation();
    e.preventDefault();

}








/* Okay so I just played around with his code until it did what I wanted it to do
so i'm not entirely sure what everything's doing but :
im making an upperstring and lowerstring like in tutorial 3
chords print first then lyrics get printed 25 pixels below the chords
The chords/lyrics get their colours from the drawCanvas function above so that function will check if
it's a lyric or a chord and choose a colour accordingly
I distinguish each chord or lyric by pushing it into the words array with a property "chord" or "lyric" (see line 306)*/

function parseChordProFormat(chordProLinesArray){
    //parse the song lines with embedded chord pro chords into individual movable words

	//clear any newline or return characters as a precaution
	for(var i=0; i<chordProLinesArray.length; i++) {
        chordProLinesArray[i] = chordProLinesArray[i].replace(/(\r\n|\n|\r)/gm,"");

	}

    var lyricLine = ''; //string representing the words and chords

    //add lines of text to html <p> elements
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = '';

    for(var i=0; i<chordProLinesArray.length; i++) {
       var line = chordProLinesArray[i];
	   textDiv.innerHTML = textDiv.innerHTML + `<p> ${line}</p>`

	   lyricLine = ''; //line of lyrics and chords
	   var upperString = '';
	   var lowerString = '';
	   //separate chords and lyrics by a blank. Preserve the [] characters in chord symbols

	   var isChord = false;
	   for (var charIndex = 0; charIndex < line.length; charIndex++){

	   	var ch = line.charAt(charIndex);
	   	if (ch == '['){
	   		isChord = true;
	   		upperString+="";
	   	}
	   	else if (ch == ']'){

	   		upperString += "";
	   		isChord = false;
	   	}else if (isChord){
	   		upperString += ch;
	   	}else{
	   		upperString += " ";
	   	}
	   }

	   lyricLine = upperString;
	    var characterWidth = canvas.getContext('2d').measureText('m').width;  //width of one character

	 //Make drag-able words
	 lyricOrChord = lyricLine;
	 lyricLine += ' '; //add blank to lyrics line just so it ends in a blank
	 if(lyricLine.trim().length > 0){
	   var theLyricWord = '';
	   var theLyricLocationIndex = -1;
	   for(var j=0; j<lyricLine.length; j++){
	      var ch = lyricLine.charAt(j);
		  if(ch == ' '){
		    //start or end of word or chord symbol
			if(theLyricWord.trim().length > 0){

				if (lyricOrChord == upperString){
					words.push({word: theLyricWord,
			               x: leftMargin + theLyricLocationIndex * characterWidth,
                           y: topMargin + i * 2 * lineHeight + lyricLineOffset,
						   chord: 'lyric'
                           });
				} else{
					words.push({word: theLyricWord,
			               x: leftMargin + theLyricLocationIndex * characterWidth,
                           y: topMargin + i * 2 * lineHeight + lyricLineOffset,
						   lyric: 'lyric'
                           });
				}

			}
		    theLyricWord = '';
			theLyricLocationIndex = -1;

		  }
          else{
		    //its part of a lyric word
			theLyricWord += ch;
			if(theLyricLocationIndex === -1) theLyricLocationIndex = j;
		 }
	   }
	 } //end make lyric chord words

	   for (var charIndex = 0; charIndex < line.length; charIndex++){

	   	var ch = line.charAt(charIndex);
	   	if (ch == '['){
	   		isChord = true;
	   		lowerString+=" ";
	   	}
	   	else if (ch == ']'){

	   		lowerString += " ";
	   		isChord = false;
	   	}else if (isChord){
	   		lowerString += "";
	   	}else{
	   		lowerString += ch;
	   	}
	   }

	   lyricLine = lowerString;

	    characterWidth = canvas.getContext('2d').measureText('m').width;  //width of one character

	 //Make drag-able words
	 lyricOrChord = lyricLine;
	 lyricLine += ' '; //add blank to lyrics line just so it ends in a blank
	 if(lyricLine.trim().length > 0){
	   theLyricWord = '';
	   theLyricLocationIndex = -1;
	   for(var j=0; j<lyricLine.length; j++){
	      ch = lyricLine.charAt(j);
		  if(ch == ' '){
		    //start or end of word or chord symbol
			if(theLyricWord.trim().length > 0){

				if (lyricOrChord == upperString){
					words.push({word: theLyricWord,
			               x: leftMargin + theLyricLocationIndex * characterWidth,
                           y: topMargin + i * 2 * lineHeight + lyricLineOffset,
						   chord: 'lyric'
                           });
				} else{
					words.push({word: theLyricWord,
			               x: leftMargin + theLyricLocationIndex * characterWidth,
                           y: (topMargin + i * 2 * lineHeight + lyricLineOffset) + 25,
						   lyric: 'lyric'
                           });
				}

			}
		    theLyricWord = '';
			theLyricLocationIndex = -1;

		  }
          else{
		    //its part of a lyric word
			theLyricWord += ch;
			if(theLyricLocationIndex === -1) theLyricLocationIndex = j;
		 }
	   }
	 } //end make lyric chord words



	   // console.log(upperString);


 	 //Now turn lyrics line into individual drag-able words
	 //Create Movable Words

  }

}


function handleSubmitButton () {

    var userText = $('#userTextField').val(); //get text from user text input field
	//clear lines of text in textDiv
    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = '';

	if(userText && userText !== ''){
	   var userRequestObj = {text: userText};
       var userRequestJSON = JSON.stringify(userRequestObj);
	   $('#userTextField').val(''); //clear the user text field

       //alert ("You typed: " + userText);
	   $.post("fetchSong", userRequestJSON, function(data, status){
			console.log("data: " + data);
			console.log("typeof: " + typeof data);
			var responseObj = data;
			movingString.word = responseObj.text;
			words = []; //clear drag-able words array;
			if(responseObj.songLines) parseChordProFormat(responseObj.songLines);
			});
	}

}

function handleRefreshButton(){

	let textDiv = document.querySelector("#text-area");

	for (var i = 0; i < words.length;i++){
			textDiv.innerHTML += words[i].word ;
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
