/**
 * New node file
 */
var  http = require('http');
var express = require('express');
var sql = require('mysql');
var fs = require('fs');
//var jsdom=require('jsdom');
var app= express();

/*
jsdom.env({
	html:"./public/index.html",
	done : function(errors,windows){
		console.log(windows);
		console.log(windows.document.getElementsByTagName('h1')[0].textContent);
		
	}
});
*/
/*
var data_array;
fs.readFile('./input.txt','utf8',function(err,data){
	if(err) throw err;
	//console.log(data);
	data_array=data.split('\t');
	console.log(data_array);
} );
*/

var connection =sql.createConnection({
	host :'localhost',
	port : 3306,
	user : 'root',
	password : '1234',
	database : 'my_report'
});
connection.connect(function(err){
	if(err){
		console.error('mysql connection error');
		console.error(err);
		throw err;
	}
});

connection.query('SELECT * FROM my_report.mydata',function(err,rows){
	if(err){
		console.log("mysql failure");
		throw err;
	}
	var data = '[';
	//mydata=rows.split(',');
	//console.log(mydata);
	//app.use(express.static('public'));
	//console.log();
	rows.forEach(function(value, index, thisArr){
	    data += ('[' + index.toString() + ', ');
	    //data += (value.temp + ', ');
	    data += (+value.temp + '], ');

	  });
	data = data.slice(0, -2);
	  data += ']';
	//  data = ("data.addRows(" + data + ");\n");
	//console.log(data);
	
	app.use(function(request,response){
		 response.writeHead(200,{"Content-Type": "text/html"});
		 response.write("<html>\n");
		 response.write("<head>\n");
		 response.write('<script type="text/javascript" src="https://www.google.com/jsapi"></script>\n');
		 response.write('<script type="text/javascript">\n');
		 response.write("google.load('visualization', '1.0', {'packages':['corechart']});\n");
		 response.write("google.setOnLoadCallback(drawChart);\n");
		 response.write("function drawChart() {\n");
		 response.write("var data = new google.visualization.DataTable();\n");
		 response.write("data.addColumn('number', 'time');\n");
		 response.write("data.addColumn('number', 'temp');\n");
		// response.write("data.addRows([\n");
		 //response.write("['Mushrooms', 3],\n");
		 //response.write("['Onions', 1],\n");
		 //response.write("['Olives', 1],\n");
		 //response.write("['Zucchini', 1],\n");
		 //response.write("['Pepperoni', 2]\n");
		 //response.write("]);\n");
		 //data=[['Mushrooms', 3],['Onions', 1],['Olives', 1],['Zucchini', 1],['Pepperoni', 2]];
		 console.log(data);
		 response.write("data.addRows(" + data + ");\n");
		// response.write("data.addRows([['Mushrooms', 3],['Onions', 1],['Olives', 1],['Zucchini', 1],['Pepperoni', 2]]);\n");
		 response.write("var options = {'title':'How Much Pizza I Ate Last Night','width':1028,'height':960};\n");
		 response.write("var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));\n");
		 response.write(" chart.draw(data, options);\n");
		 response.write("}\n");
		 response.write("</script>\n");
		 response.write("</head>\n");
		 response.write("<body>\n");
		 response.write("<div id='chart_div'></div>\n");
		 response.write("</body>\n");
		// res.write("<h1>123123123</h1>");
		 response.write("</html>\n");
		 //response.write(data+"\n");
		 response.end();
	});
	
});
connection.end();
http.createServer(app).listen(8108,function(){
	console.log('Server Running at http://127.0.0.1:8108');
});