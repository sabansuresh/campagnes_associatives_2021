const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const path = require('path');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('memory');
var xss = require('xss');

// Les données sur les listes

const abordage = require('./objects/BDA/abordage.json');
const spationautes = require('./objects/PAO/spationautes.json');
const weistern = require('./objects/WEI/weistern.json');
const sdec = require('./objects/SDEC/sdexter.json');
const birates = require('./objects/BI/Birate.json');
const ctn = require('./objects/CTN/revancheDesCTN.json');
const eco = require('./objects/ECO/SherlECOlmes.json');
const ph = require('./objects/PH/reconphort.json');
const teletubies = require('./objects/BI/teletuBIes.json');
const bdr = require('./objects/BDR/BDAirKO.json');
const gala = require('./objects/GALA/galalPacino.json');
const relex = require('./objects/Relex/angelaMerkelex.json');

listes = {
  "BDA": [abordage,{nom: "Gér'art Jugnot",pipo:true,clickable:false,logo:"/BDA/gerart.jpg", standalone: false},{nom: "Artine Marion",pipo:true,clickable:false,logo:"/BDA/artine.jpg", standalone: false},{nom: "Bureau de l'Amour",pipo:true,clickable:false,logo:"/BDA/amour.png", standalone: false}],
  "BDE": [{ nom: "Les Gosthlisters", logo: "BDE/ghostlisters.png", pipo: false, standalone: true, link:"ghostlisters", clickable : true},
  { nom: "koh-lanta L'iste des héros", logo: "BDE/listeHeros.jpg", pipo: false, html: "BDE/heros" ,standalone: false, clickable : true  },
  { nom: "Bureau Des Etoiles", logo: "/BDE/manda.jpg", pipo: true , clickable : false }
  ],
  "BDR":[bdr,{nom: "Bureau du Redoublement",pipo:true,clickable:false,logo:"/BDR/redoublement.png", standalone: false},{nom: "BDéric Zemmour",pipo:true,clickable:false,logo:"/BDR/bdz.jpg", standalone: false}],
  "ECLAIR": [{ nom: "404 dead Link", logo: "ECLAIR/DeadLink.png", pipo: false , standalone: true, link:"deadlink", clickable : true},
  { nom: "pipo Éclair", logo: "icon.png", pipo: true, standalone: false, clickable : true}
  ],
  "PAO": [spationautes,{nom: "Pipo Sword Online",pipo:true,clickable:false,logo:"/PAO/pipao.png", standalone: false}],
  "WEI": [weistern,{nom:"Peaky WEI'nders", logo :"WEI/peaky.png" , pipo:false, standalone:true,link:"peaky", clickable : true}],
  "PLANET8CO" : [eco,{nom: "Pas-net & Kro",pipo:true,clickable:false,logo:"/ECO/panet.png", standalone: false}],
  "BI": [birates,teletubies],
  "SDeC": [sdec],
  "RELEX":[relex],
  "GALA":[gala],
  "PH":[ph],
  "CTN":[ctn]
  }

const voteDate = '2021-02-04 00:00';

/*
for (const asso in data) {
  if (Object.hasOwnProperty.call(data, asso)) {
    const listes = data[asso];

    listes.forEach(liste => {
      
    });
    
  }
}*/

const app = express();
app.set('view-engine', 'ejs');

var dir = path.join(__dirname);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(dir));


// bdd
//createdb = function () {
  db.serialize(function () {
    db.run("CREATE TABLE assos (id  INTEGER PRIMARY KEY AUTOINCREMENT  , nom VARCHAR(100), listes TEXT)");

    var stm = db.prepare("INSERT INTO assos (nom, listes) VALUES (?, ?) ");

    for (const asso in listes) {
      if (Object.hasOwnProperty.call(listes, asso)) {
        const listes_ = listes[asso];
        obj = [];
        listes_.forEach(liste => {
          obj.push({
            liste: liste.nom,
            votes: 0
          });
        });
        obj.push({
          liste: 'blanc',
          votes: 0
        });
        stm.run(asso, JSON.stringify(obj));

      }
    }

    stm.finalize();

    db.each("SELECT * FROM assos", function (err, row) {
      console.log(row);
    });
  });
//};
//createdb();

app.get('/', async (req, res) => {
  res.render("index.ejs", { data: listes, showLinkToVotePage: new Date() > new Date(voteDate), showLinkToResultsPage: false }); // générer la page et la renvoyer
});

app.get('/login', async (req, res) => {
  res.render("login.ejs"); // générer la page et la renvoyer
});

app.get('/deadlink', async (req, res) => {
  res.render("presentations/ECLAIR/404.ejs", { data: listes }); // générer la page et la renvoyer
});

app.get('/ghostlisters', async (req, res) => {
  res.render("presentations/BDE/ghostlisters.ejs", { data: listes }); // générer la page et la renvoyer
});

app.get('/peaky', async (req, res) => {
  res.render("presentations/WEI/peaky.ejs", { data: listes }); // générer la page et la renvoyer
});

app.get('/vote', async (req, res) => {
  res.render("vote.ejs", { data: listes }); // générer la page et la renvoyer
});

app.get('/results_data', async (req, res) => {
  results = [];
  db.all("SELECT * from assos", (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.json(results); // renvoyer les résultats au format json
    }
  })
})

app.get('/results', async (req, res) => {
  res.render("results.ejs", { listes: listes }); // générer la page et la renvoyer
});

app.post('/vote_post', async (req, res) => {

  console.log(req.body);
  // var user_id='hmenard';
  var user_id = xss(req.body.user_id);

  db.all("SELECT voted FROM adherents WHERE id=?", [user_id], (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (rows.length != 1) {
      console.error('nb users with id ' + user_id + ' rows.length ' + ' = ' + rows.length + ' not equal to 1');
      res.sendStatus(500);
    } else {
      console.log(rows);
      if (rows[0].voted) {
        console.error("l'utilisateur " + user_id + " a déja voté");
        res.sendStatus(500);
      } else {
        db.each("SELECT nom AS asso, listes FROM assos", function (err, row) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            console.log(row);
            l = JSON.parse(row.listes);
            console.log("\nl:\n");
            console.log(l);
            console.log(row.asso);

            if (req.body[row.asso] && Object.hasOwnProperty.call(l, req.body[row.asso])) {

              console.log(req.body[row.asso]);
              l[req.body[row.asso]].votes += 1;
              console.log(l[req.body[row.asso]]);

              var update = db.prepare("UPDATE assos SET listes=? WHERE nom=? ");

              update.run(JSON.stringify(l), row.asso);

              update.finalize();

              console.log("\ndb:\n");

              var add_has_voted = db.prepare("update adherents set voted=true where id=?;");

              add_has_voted.run(user_id);

              add_has_voted.finalize();


              db.each("SELECT * FROM assos", function (err, row) {
                console.log(row);
              });

            }
          }

        });
        res.render("index.ejs", { data: listes, showLinkToVotePage: new Date() > new Date(voteDate), showLinkToResultsPage: false }); // générer la page et la renvoyer   

      }
    }
  });


})

app.get('*', function (req, res) {
  res.redirect('/') // rediriger toutes les pages sur la page principale
});

var server = http.createServer(app);

server.listen(process.env.PORT || 8080, () => {
  console.log(`App Started on PORT ${process.env.PORT || 8080}`);
});


