var http = require("http");
var form = require("./form.html");


http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as an html file
   response.end(form);
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');