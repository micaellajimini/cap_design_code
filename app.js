var express = require('express');
var fs = require('fs');
var date = require('date-and-time');
var mysql = require('mysql');
var Promise = require('bluebird');
var security = require('./config_jimin');

var app = express();
var connection = mysql.createConnection({
	host : security.host,
	user : security.user,
	password : security.passwd,
	database : security.db
})
connection.connect();


app.set('views','./views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/log', function(req,res){
	console.log(req.query);
	var now = new Date();
	now = date.addHours(now,9);
	console.log(date.format(now,"YYYY/MM/DD/HH/mm/ss"));
	var querydata = {};
	querydata.time = now;
	querydata.value = req.query.temp;
	querydata.ip = security.dataip;

	sql = "insert into sensors set ?";

	connection.query(sql,querydata, (err, rows, fields) => {
		if(err){
			throw err;
                }
        })
});

app.get('/showgraph', function(req,res){
	var max,min;
	//change to mysql db
	var sql = "select value, time from sensors order by time DESC limit 120;"
	connection.query(sql, (err, rows, fields) => {
		if(err){
			throw err;
                }
		var arrsize = rows.length;
		for(var i=0;i<arrsize;i++){
			if(i==arrsize-1) max = rows[i].time;
			if(i==0) min = rows[i].time;
		}
		res.render('index.html',{'dataa' : rows, 'min' : min, 'max' : max})
		//console.log(min,max);
	})

})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
