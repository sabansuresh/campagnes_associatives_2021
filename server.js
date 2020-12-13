const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const path = require('path');

/*listes = {
  bde: [ {nom: "gosthlisters", logo: "ghostlisters.jpg", pipo: false, html: "gosth.html"},
         {nom: "koh-lanta L'iste des héros", logo: "listeHeros.jpg", pipo: false , html: "heros.html"}
       ],
  eclair: [ {nom: "404 dead Link", logo: "listeLink.jpg", pipo: false, html: "link.html"},
            {nom: "Adolf Éclair", logo: "listeAdolf.jpg", pipo: true, membres: ["Deenay", "Harrah"]}
          ]
}*/

listes = {
  eclair: [ {nom: "link", logo: "ghostlisters.png", pipo: false, html: "gosth.html"},
            {nom: "adolf", logo: "listeHeros.jpg", pipo: true , html: "heros.html"},
            {nom: "adolf", logo: "listeHeros.jpg", pipo: true , html: "heros.html"},
            {nom: "adolf", logo: "listeHeros.jpg", pipo: true , html: "heros.html"},
            {nom: "adolf", logo: "listeHeros.jpg", pipo: true , html: "heros.html"}

          ],
  bde: [ {nom: "gosthlisters", logo: "ghostlisters.png", pipo: false, html: "gosth.html"},
         {nom: "koh-lanta L'iste des héros", logo: "listeHeros.jpg", pipo: false , html: "heros.html"},
         {nom: "koh-lanta L'iste des héros", logo: "listeHeros.jpg", pipo: false , html: "heros.html"},
         {nom: "adolf", logo: "listeHeros.jpg", pipo: true , html: "heros.html"}
  ],
  eclair2: [ {nom: "link2", logo: "ghostlisters.png", pipo: false, html: "gosth.html"},
            {nom: "adolf2", logo: "listeHeros.jpg", pipo: true , html: "heros.html"},
            {nom: "adolf", logo: "listeHeros.jpg", pipo: true , html: "heros.html"}
          ]
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
    res.render("index.ejs", {data: listes});
});



app.get('*', function(req, res){
	res.redirect('/')
  });


var server = http.createServer(app);

server.listen(process.env.PORT || 8080,() => {
	console.log(`App Started on PORT ${process.env.PORT || 8080}`);
});






