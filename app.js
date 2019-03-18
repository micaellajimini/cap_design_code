var express = require('express');
var fs = require('fs');
var date = require('date-and-time');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/log', function(req,res){
	console.log(req.query);
	var now = new Date();
	now = date.addHours(now,9);
	console.log(date.format(now,"YYYY/MM/DD HH:mm:ss"));
	fs.open('log.txt', 'a', (err, fd) => {
  		if (err) throw err;
  		fs.appendFile(fd, date.format(now,"YYYY/MM/DD HH:mm:ss") +' '+ req.query.temp+'\n', 'utf8', (err) => {
    			fs.close(fd, (err) => {
      				if (err) throw err;
    			});
    			if (err) throw err;
  		});
	});	
});

app.get('/dump', function(req,res){
	var count = req.query.count;
	var cnt = count;
	var dataa = [];
	var result = {};
	fs.readFile('log.txt','utf-8', function(err,data){
		if(err) throw err;
		var array = data.toString().split('\n');
		var arrsize = array.length;
		if(count > arrsize-1){
			result["error"]="there are less data than count\n";
			cnt = arrsize-1;
		}
		for(var i=0;i<cnt;i++){
			dataa.push(array[arrsize-2-i]);
		}
		result["data"] = dataa;
		res.send(result);
	});
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
