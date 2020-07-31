var http = require('http');
var db = require('./database');
var fs = require('fs');
var lib = require('./lib');
http.createServer(function (request, response) {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      var res = Direction(request, body);
      if(res == "")
      {
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.write('Hello World!');
          response.end();
      }else {
          fs.readFile('./index.html', function (err, html) {
              if (err) {
                  throw err; 
              }       
              response.writeHeader(200, {"Content-Type": "text/html"});  
              response.write(html);  
              response.end(); 
          });
      }
    });
   
}).listen(8080);
console.log("Server start in port 8080");

function Direction(request, body) {
    if(request.method == 'POST')
    {
        //call Back Function
        var data = JSON.parse(body);
        db.updateDownLoad(data.message, function(err, info){
            if(err) {
                console.log(err);
                return;
            }
            lib.downloadAudio(info.direction, info.fileName, info.url);
        });
        return "";
    }
    else if (request.method == 'GET'){
        //Redirect function
        switch (request.url) {
            case '/':               
                break;
            case '/home':
                return "zz";
            default:
                break;
        }
    }
}