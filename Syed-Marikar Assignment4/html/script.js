$(document).ready(function (){

    console.log("hi");
  //check if user sent a query
  if(window.location.href.indexOf('?ingredients=') != -1){
    //if they did call the server route that includes a query
    var userInput = window.location.href.substring(window.location.href.indexOf('?ingredients=')+13);
    $.get('/recipes?ingredient='+userInput, function(response, stat) {
      processInformation(response);
    });
  }
  else {
  $.get('/recipes', function(response, stat) {
    processInformation(response);
  });
}


});

function processInformation(response){

  var recipeList = response.recipes;
  //console.log(recipeList[i]);
  for(var i = 0; i < recipeList.length;i++){
      console.log(recipeList[i]);
    //create divs for each recipe, and add the information and links to it
    var recipeDiv = $('<div class = "recipe">');
    var image = $('<a target="_blank" href="'+recipeList[i].source_url + '"><img src="'+recipeList[i].image_url+'">');
    var h1 = $('<h1>').html(recipeList[i].title);
    recipeDiv.append(image);
    recipeDiv.append(h1);
    $('#container').append(recipeDiv);
  }
}

function enterQuery(){
  //refresh the window and add the query items to the url
  window.location.href = 'http://localhost:3000?ingredients=' + $('#userInput').val();
}
