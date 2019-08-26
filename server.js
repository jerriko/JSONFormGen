var http = require("http");
var fs = require('fs');
var qs = require('querystring');
var express = require('express');
const FormApp = require("./formgen.js");

var getFile = "<form method='post' action='http://localhost:8081'><label>File: </label><input type='file' name='file'></input><br><input type='submit'>Submit</input></form>";

http.createServer(function (request, response) {
	if(request.method == 'POST') {
		var body = '';
		/*express.use(express.urlencoded());
		
		express.post('/', function(request,response){
			console.log(request.body);
			file = request.body;
		});
		*/
		request.on('data', function(data) {
			body += data;
			if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
		});
		request.on('end', function() {
		  var file = qs.parse(body).file;
		  var filecontents = fs.readFileSync(file).toString();
		  console.log(filecontents);
		  let myapp = new FormApp(filecontents);
		  var debug = myapp.generateApp();
		  response.writeHead(200, {'Content-Type': 'text/html'});
		  response.end('post received: ' + debug);
		});
		
	}
	else {
	   // Send the HTTP header 
	   // HTTP Status: 200 : OK
	   // Content Type: text/plain
	   response.writeHead(200, {'Content-Type': 'text/html'});
	   response.write(getFile);
	   // Send the response body as a zipped file
	   response.end();
	}
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');