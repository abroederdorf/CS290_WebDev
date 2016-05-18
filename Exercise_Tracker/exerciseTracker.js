/*******************************
* Alicia Broederdorf
* December 1, 2015
* Description: Let's the user add activities to
* exercise tracking database. Can update and delete
* activities as well. Add & delete with AJAX
********************************/

//Include required modules
var express = require('express');
var mysql = require('./dbConnect.js');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');

//Setup
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(express.static('public'));

//Route handler for tracker page
app.get('/tracker', function(req, res, next){
	var content = {};
	
	res.render('home', content);
});

//Route handler for root page showing select
app.get('/', function(req, res, next){
	var content = {};

	mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		
		//Get response and send back
		content = JSON.stringify(rows);
		res.send(content);
	});
});

//Route handler for inserting
app.get('/insert', function(req, res, next){
	var content = {};

	mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.n, req.query.r, req.query.w, req.query.d, req.query.u], function(err, result) {
		if(err){
			next(err);
			return;
		}
		
		//Get results and return
		content = "Inserted id " + result.insertId;
		res.send(content);
	});
});

//Route handler for deleting
app.get('/delete', function(req, res, next){
	var content = {};

	mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
		if(err){
			console.log(err);
			next(err);
			return;
		}
		
		//Get results and return
		content = "Deleted " + result.affectedRows + " row.";
		res.send(content);
	});
});

//Route handler for updating data
app.get('/update', function(req, res, next){
	var content = {};
	
	//Return selected row
	mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		//Check that only one row was returned
		if (result.length == 1){
			//Save the values from the row returned to use if no new value has been provided
			var current = result[0];
			mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", [req.query.n || current.name, req.query.r || current.reps, req.query.w || current.weight, req.query.d || current.date, req.query.u || current.lbs, req.query.id], function(err, result){
				if(err){
					next(err);
					return;
				}
				content = "Updated " + result.changedRows + " row.";
				res.send(content);
			});
		}
	});
});

//Route for reseting table
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context = "Table reset";
      res.send(context);
    })
  });
});

//Render page for testing
app.get('/testPage', function(req, res, next){
	var content = {};
	mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		
		//Get response and send back
		content.rows = JSON.stringify(rows);
		res.render('test',content);
	});
});

//Page not found route
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//Server error route
app.use(function(err, req, res,next){
	res.status(500);
	res.render('500');
});

//Message to console when program started
app.listen(app.get('port'), function (){
	console.log('Program has started on http://localhost:' + app.get('port') + '; Press ctrl-C to terminate.');
});