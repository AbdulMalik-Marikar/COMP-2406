const express = require('express') //express framework
var http = require('http');
//npm module for easy http requests
const PORT = process.env.PORT || 3000


const FOOD_API_KEY = '5d1dd99edc65e3794fcb550af20a841a' //PUT IN YOUR OWN KEY HERE

const app = express()

//Middleware
app.use(express.static(__dirname + '/html')) //static server

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/recipes.html', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/index.html', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/recipes', (request, response) => {
  let ingredients = request.query.ingredient;
  //if ingredients is equal to null, no query was given and we will show the default recipes
  if(!ingredients) {
    response.sendFile(__dirname + '/views/index.html')
  }
  //if ingredients is not null, we include the query in our requst
  else {
    var options = {
      method: 'POST',
      host: 'food2fork.com',
      path: '/api/search/?key=5d1dd99edc65e3794fcb550af20a841a&q=' + ingredients
    };
  }

  var req = http.get(options, function(res) {
    var content = '';
    res.on('data', function(chunk) {
      content += chunk;
    }).on('end', function() {
      var obj = JSON.parse(content);
      var recipes = [];
      for(var i = 0; i < obj.recipes.length; i++){
        var tempObj = {};
        //only add the neccessary information that we need
        tempObj.image_url = obj.recipes[i].image_url;
        tempObj.title = obj.recipes[i].title;
        tempObj.source_url = obj.recipes[i].source_url;
        recipes.push(tempObj);
      }
      //return the information
      return response.json({"recipes":recipes});
    });
  }).on('error', function(e){
    console.log("error:", e);
  });
  req.end();

});

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
  }
})
