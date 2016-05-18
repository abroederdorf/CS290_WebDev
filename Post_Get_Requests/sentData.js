/***********************
* Alicia Broederdorf
* November 11, 2015
* HW Week 7, GET and POST
* CS 290, Fall 2015
***********************/

//Add modules
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

//Set route for home page
app.get('/', function(req, res){
	res.render('home');
});

//Set route for GET request
app.get('/sentData', function(req, res) {
	var getParams = [];
	for (var item in req.query){
		getParams.push({'name':item, 'value':req.query[item]});
	}

	var data = {typeReq: "GET"};
	data.dataItems = getParams;
	res.render('sentData', data);
});

//Set route for POST request
app.post('/sentData', function(req, res) {
	var postParams = [];
	for (var item in req.body){
		postParams.push({'name':item, 'value':req.body[item]});
	}

	var data = {typeReq: "POST"};
	data.dataItems = postParams;
	res.render('sentData', data);
});

//Set route for unknown page
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//Set route for server error
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

//Post to console to know program is running
app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
