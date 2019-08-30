var http = require("http");
var fs = require('fs');
var qs = require('querystring');
var exp = require('express');

const FormApp = require("./formgen.js");

//Get form html template from path
var htmlfile = './package/form.html';
var htmlTemplate = fs.readFileSync(htmlfile).toString();

//We'll use jQuery to replace content in template file server-side.
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
var html = new JSDOM(htmlTemplate, { runScripts: "dangerously" });
var $ = jQuery = require('jquery')(html.window);

//Form to retrieve filepath of json template
var getFile = "<form method='post' action='http://localhost:8081'><label>File: </label><input type='file' name='file'></input><br><input type='submit'>Submit</input></form>";
//File error message
var fileError = "<p> There was an error with the file you uploaded. Please make sure the file is a correctly formatted .json file.</p>";
var br = "<br />";

http.createServer(function (request, response) {
	//Read json file 
	if(request.method == 'POST') {
		var body = '';
		request.on('data', function(data) {
			body += data;
			if (body.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
		});
		request.on('end', function() {
		  response.writeHead(200, {'Content-Type': 'text/html'});
		  //Parse filepath from post data
		  var file = qs.parse(body).file;
		  //return error if file is not .json
		  if(! file.includes('.json',file.length-5)) {
			  response.end(fileError + br + getFile);
			  return;
		  }
		  
		  //Read file to string
		  var filecontents = fs.readFileSync(file).toString();
		  //Create FormApp using .json contents
		  let myapp = new FormApp(filecontents);
		  
		  //Debugging: return html form
		  var debug = myapp.generateApp();
		  
		  //Replace content div with actual content
		  $('.content').html(debug);

		  //console.log(html.window.document.querySelector('html').innerHTML);
		  
		  //return html form for debugging
		  response.end(html.window.document.querySelector('html').innerHTML);
		});
		
	}
	//Ask for json file
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