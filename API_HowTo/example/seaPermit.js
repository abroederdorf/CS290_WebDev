/**********************
* Name: Alicia Broederdorf
* Date: November 27, 2015
* Description: This app will get data from the Seattle city government
* and display it
***********************/

//Include required modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var apiKeys = require('./apiKeys.js');
var request = require('request');

//Setup
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port',3300);
app.use(express.static('public'));

//Get route handler, home page
app.get('/', function(req, res){
	var content = {};
	var results = [];
	
	content.results = results;
	res.render('home', content);	
});

//Post route handler, results page with search
app.post('/', function(req, res){
	var content = {};
	var results = [];
	
	//Build query string based on user provided inputs
	var reqStr = "";
	if (req.body.type != "")
		reqStr += ('&permit_type=' + req.body.type);
	if (req.body.category != "")
		reqStr += ('&category=' + req.body.category);
	if (req.body.stat != "")
		reqStr += ('&status=' + req.body.stat);
	
	if (req.body.valueGT != "")
	{
		reqStr += ('&$where=value>' + req.body.valueGT);
		if (req.body.valueLT != "")
			reqStr += ('+AND+value<' + req.body.valueLT);
	}
	else if (req.body.valueLT != "")
		reqStr += ('&$where=value<' + req.body.valueLT);
	
	//Make request using extension
	//i5jq-ms7b
	//mags-97de
	if (req.body['searchExt'])
	{
		request('https://data.seattle.gov/resource/mags-97de.json?' + reqStr + '&$order=issue_date+DESC&$$app_token=' + apiKeys.seaData, getResponse);	
		//console.log('Request made using extension');
	}
	else
	{
		//Create header
		var options = {
			url: 'https://data.seattle.gov/resource/mags-97de?' + reqStr + '&$order=issue_date+DESC',
			headers: {
				'Accept': 'application/json',
				'X-App-Token': apiKeys.seaData
			}
		};
		
		//Make request
		request(options, getResponse);
		//console.log('Request made using header');
	}
	
	function getResponse(err, response, body){
		if (!err && response.statusCode < 400)
		{
			//Extract data from response
			var searchResults = JSON.parse(body);
			
			for (var item in searchResults)
			{
				//Determine color of row if permit has been issued
				var color;
				if (searchResults[item].status == "Permit Issued")
					color = '#7FE817';
				else 
					color = '#F75D59';
				
				//Add data row to array of results
				results.push({"type":searchResults[item].permit_type, "address":searchResults[item].address, "category":searchResults[item].category, "value":searchResults[item].value, "stat":searchResults[item].status, "issueDate":searchResults[item].issue_date, "description":searchResults[item].description, "statusColor":color});
			}
			content.results = results;
			
			//Render page with results
			res.render('home', content);
		}
		else
		{
			console.log(err);
			if (response)
				console.log(response.statusCode);
			next(err);
		}
	}	
});

//Page not found route
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//Server error route
app.use(function(err, req, res, next){
	res.status(500);
	res.render('500');
});

//Print to console when program is running
app.listen(app.get('port'), function() {
	console.log('Program has started on http://localhost:' + app.get('port') + '; Press ctrl-C to terminate.');
});