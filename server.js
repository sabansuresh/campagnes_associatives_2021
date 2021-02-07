const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const sqlite = require('aa-sqlite');
var db = new sqlite.open('memory.db');
var xss = require('xss');
const passport = require('passport');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const dotenv = require('dotenv').config();

// Les données sur les listes

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
const bar = require('./objects/BAR/barbie.json');
const dbs = require('./objects/DBS/DrBonnesStr.json');

listes = {
	BDA: [
		{
			nom: 'À l’Abord’art',
			logo: 'BDA/logo.png',
			pipo: false,
			html: 'BDA/abordage',
			standalone: false,
			clickable: true
		},
		{ nom: "Gér'art Jugnot", pipo: true, clickable: false, logo: '/BDA/gerart.jpg', standalone: false },
		{ nom: 'Artine Marion', pipo: true, clickable: false, logo: '/BDA/artine.jpg', standalone: false },
		{ nom: "Bureau de l'Amour", pipo: true, clickable: false, logo: '/BDA/amour.png', standalone: false }
	],
	BDE: [
		{
			nom: 'Les GhostListers',
			logo: 'BDE/ghostlisters.png',
			pipo: false,
			standalone: true,
			link: 'ghostlisters',
			clickable: true
		},
		{
			nom: "Koh-Lanta L'iste des héros",
			logo: 'BDE/listeHeros.jpg',
			pipo: false,
			html: 'BDE/heros',
			standalone: false,
			clickable: true
		},
		{ nom: 'Bureau Des Etoiles', logo: '/BDE/manda.jpg', pipo: true, clickable: false }
	],
	BDR: [
		bdr,
		{
			nom: 'Bureau du Redoublement',
			pipo: true,
			clickable: false,
			logo: '/BDR/redoublement.png',
			standalone: false
		},
		{ nom: 'BDéric Zemmour', pipo: true, clickable: false, logo: '/BDR/bdz.jpg', standalone: false }
	],
	ECLAIR: [
		{
			nom: '404 dead Link',
			logo: 'ECLAIR/DeadLink.png',
			pipo: false,
			standalone: true,
			link: 'deadlink',
			clickable: true
		},
		{ nom: 'Adolf Éclair', logo: 'ECLAIR/Adolf.png', pipo: true, standalone: false, clickable: false }
	],
	PAO: [
		spationautes,
		{ nom: 'Pipo Sword Online', pipo: true, clickable: false, logo: '/PAO/pipao.png', standalone: false }
	],
	WEI: [
		weistern,
		{
			nom: "Peaky WEI'nders",
			logo: 'WEI/peaky.png',
			pipo: false,
			standalone: true,
			link: 'peaky',
			clickable: true
		},
		{ nom: 'We Are Still WEIting Again', logo: 'WEI/weiting.png', pipo: true, standalone: false, clickable: false }
	],
	PLANET8CO: [
		eco,
		{ nom: 'Pas-net & Kro', pipo: true, clickable: false, logo: '/ECO/panet.png', standalone: false }
	],
	BAR: [ bar ],
	PH: [ ph, { nom: "L'EPHAD", pipo: true, clickable: false, logo: '/PH/ephad.png', standalone: false } ],
	BI: [ birates, teletubies ],
	SDeC: [ sdec ],
	DBS: [ dbs ],
	RELEX: [
		{
			nom: 'Angela Merkelex',
			logo: 'RELEX/angelaMerkelex.jpg',
			pipo: false,
			html: 'RELEX/angela',
			standalone: false,
			clickable: true
		}
	],
	GALA: [ gala ],
	CTN: [ ctn ]
};

const voteDate = '2021-02-03 23:00';
const endVoteDate = '2021-03-04 23:00';

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

async function checkHasVoted(ID) {
	let sqlCheck = 'SELECT * FROM adherents WHERE ID = (?)';
	res = await sqlite.all(sqlCheck, [ ID ]);
	if (res.length == 0) {
		console.log('he');
		return -1;
	} else {
		if (res[0].voted == 1) {
			return 1;
		}
		if (res[0].voted == 0) {
			return 0;
		}
	}
}

const app = express();
app.set('view-engine', 'ejs');
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		httpOnly: true,
		secure: true
	})
);

var dir = path.join(__dirname);

async function getUserbyEmail(email) {
	let sql = 'SELECT * FROM adherents Where Email = (?)';
	results = await sqlite.all(sql, [ email.toLowerCase() ]);
	return results[0];
}

async function getUserbyId(id) {
	let sql = 'SELECT * FROM adherents Where ID = (?)';
	results = await sqlite.all(sql, [ id ]);
	return results[0];
}

const initializePassport = require('./passport-config');
initializePassport(passport, getUserbyEmail, getUserbyId);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(dir));

// bdd
createdb = function() {
	db.serialize(function() {
		db.run('CREATE TABLE assos (id  INTEGER PRIMARY KEY AUTOINCREMENT  , nom VARCHAR(100), listes TEXT)');

		var stm = db.prepare('INSERT INTO assos (nom, listes) VALUES (?, ?) ');

		for (const asso in listes) {
			if (Object.hasOwnProperty.call(listes, asso)) {
				const listes_ = listes[asso];
				obj = [];
				listes_.forEach((liste) => {
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

		db.each('SELECT * FROM assos', function(err, row) {
			console.log(row);
		});
	});
};
//createdb();

app.get('/', async (req, res) => {
	res.render('index.ejs', {
		data: listes,
		showLinkToVotePage: new Date() > new Date(voteDate),
		showLinkToResultsPage: false
	}); // générer la page et la renvoyer
});

app.get('/login', async (req, res) => {
	if (new Date() > new Date(voteDate)) {
		res.render('login.ejs'); // générer la page et la renvoyer
	} else {
		res.redirect('/');
	}
});

app.get('/deadlink', async (req, res) => {
	res.render('presentations/ECLAIR/404.ejs', { data: listes }); // générer la page et la renvoyer
});

app.get('/ghostlisters', async (req, res) => {
	res.render('presentations/BDE/ghostlisters.ejs', { data: listes }); // générer la page et la renvoyer
});

app.get('/peaky', async (req, res) => {
	res.render('presentations/WEI/peaky.ejs', { data: listes }); // générer la page et la renvoyer
});

app.get('/programme.png', async (req, res) => {
	res.sendFile('programme.png');
});

app.get('/menu', checkAuthenticated, async (req, res) => {
	thisUser = await req.user;
	hasVoted = await checkHasVoted(thisUser.ID);
	console.log(hasVoted);
	conditionVote = new Date() < new Date(endVoteDate) && hasVoted == 0;
	console.log(conditionVote);
	conditionResults = new Date() > new Date(endVoteDate);
	res.render('loggedIn.ejs', { canVote: conditionVote, canSeeResults: conditionResults }); // générer la page et la renvoyer
});

app.get('/vote', checkAuthenticated, async (req, res) => {
	if (new Date() > new Date(voteDate) && new Date() < new Date(endVoteDate)) {
		thisUser = await req.user;
		if ((await checkHasVoted(thisUser.ID)) == 0) {
			res.render('vote.ejs', { data: listes }); // générer la page et la renvoyer
		} else {
			res.redirect('/');
		}
	} else {
		res.redirect('/');
	}
});

app.get('/results_data', checkAuthenticated, async (req, res) => {
	if (new Date() > new Date(endVoteDate)) {
		// results = await sqlite.all('SELECT * from assos', []);
		results = await sqlite.all('SELECT vote from adherents', []);
    console.log(results);
		res.json(results); // renvoyer les résultats au format json
	} else {
		res.sendStatus(500);
	}
});

app.get('/udnkjdankjahada', async (req, res) => {
	results = await sqlite.all('SELECT * from assos', []);
	res.json(results); // renvoyer les résultats au format json
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/menu',
		failureRedirect: '/login',
		failureFlash: true
	})
);

app.get('/results', async (req, res) => {
	if (new Date() > new Date(endVoteDate)) {
		res.render('results.ejs', { listes: listes }); // générer la page et la renvoyer
	} else {
		res.redirect('/');
	}
});

app.post('/vote_post', async (req, res) => {
	// recoit les réponses au questionnaire de vote
	pwd = 'aP4B0pcgl94q';
	thisUser = await req.user;
	hasVoted = await checkHasVoted(thisUser.ID); // On ne pas revoter
	if (hasVoted == 0) {
		/* 	let sql = 'SELECT nom AS asso, listes FROM assos';
		results = await sqlite.all(sql, []);
		if (results.length == 0) {
			console.error('erreur results.length == 0');
			res.send(500);
		} else { */
		/* for (let cpt = 0; cpt < results.length; cpt++) {
				console.log(cpt);
				row = results[cpt];
				console.log(row);
				l = JSON.parse(row.listes);
				console.log('\nl:\n');
				console.log(l);
				console.log(row.asso);

				if (req.body[row.asso] && Object.hasOwnProperty.call(l, req.body[row.asso])) {
					console.log(req.body[row.asso]);
					l[req.body[row.asso]].votes += 1;
					console.log(l[req.body[row.asso]]);

					let sqlUpdate = 'UPDATE assos SET listes=? WHERE nom=? ';
					var thisUpdate = await sqlite.all(sqlUpdate, [ JSON.stringify(l), row.asso ]);
				} */
		//}
    console.log(req.body);
    console.log(JSON.stringify(req.body));
		var add_has_voted = await sqlite.all('update adherents set voted=true, vote=? where id=?;', [
			JSON.stringify(req.body),
			thisUser.ID
		]); // enregistre le vote
	}
	res.redirect('/');
	/* res.render('index.ejs', {
			data: listes,
			showLinkToVotePage: new Date() > new Date(voteDate),
			showLinkToResultsPage: false
		}); */ // générer la page et la renvoyer
	//}
});

app.get('*', function(req, res) {
	res.redirect('/'); // rediriger toutes les pages sur la page principale
});

app.get('/RE.pdf', function(req, res) {
	res.sendFile('RE.pdf');
});

app.delete('/logout', async (req, res) => {
	req.logOut();
	res.redirect('/');
});

var server = http.createServer(app);

server.listen(process.env.PORT || 8080, () => {
	console.log(`App Started on PORT ${process.env.PORT || 8080}`);
});
