const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const path = require('path');


// Les données sur les listes

const abordage = require('./objects/BDA/abordage.json');
const spationautes = require('./objects/PAO/spationautes.json');

listes = {
  BDE: [ {nom: "gosthlisters", logo: "BDE/ghostlisters.png", pipo: false, html: "BDE/gosth"},
         {nom: "koh-lanta L'iste des héros", logo: "BDE/listeHeros.jpg", pipo: false , html: "BDE/heros"}
       ],
  ECLAIR: [ {nom: "404 dead Link", logo: "ECLAIR/DeadLink.png", pipo: false, html: "ECLAIR/404"}
          ],
  BDA : [abordage],
  PAO : [spationautes]
}


/*
for (const asso in data) {
  if (Object.hasOwnProperty.call(data, asso)) {
    const listes = data[asso];

    listes.forEach(liste => {
      
    });
    
  }
}*/

const app =	express();
app.set('view-engine','ejs');

var dir = path.join(__dirname);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(dir));

app.get('/', async (req,res) => {
    res.render("index.ejs", {data: listes}); // générer la page et la renvoyer
});

app.get('/login', async (req,res) => {
  res.render("login.ejs"); // générer la page et la renvoyer
});


app.get('/DeadLink', async (req,res) => {
  res.render("presentations/ECLAIR/404.ejs", {data: listes}); // générer la page et la renvoyer
});

app.get('*', function(req, res){
	res.redirect('/') // rediriger toutes les pages sur la page principale
  });

var server = http.createServer(app);

server.listen(process.env.PORT || 8080,() => {
	console.log(`App Started on PORT ${process.env.PORT || 8080}`);
});






