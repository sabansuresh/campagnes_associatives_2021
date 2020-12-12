const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const path = require('path');


const app =	express();
app.set('view-engine','ejs');

var dir = path.join(__dirname);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(dir));

app.get('/', async (req,res) => {
    res.render("index.ejs");
});



app.get('*', function(req, res){
	res.redirect('/')
  });


var server = http.createServer(app);

server.listen(process.env.PORT || 8080,() => {
	console.log(`App Started on PORT ${process.env.PORT || 8080}`);
});






