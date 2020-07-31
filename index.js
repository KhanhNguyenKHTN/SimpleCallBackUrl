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
      Direction(request, response, body);
    });
   
}).listen(8080);
console.log("Server start in port 8080");

function Direction(request, response, body) {
    if(request.method == 'POST')
    {
        //call Back Function
        var data = JSON.parse(body);
        console.log(data);
        db.updateDownLoad(data.message, function(err, info){
            if(err) {
                console.log(err);
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.write(err);
                response.end();
            }
            lib.downloadAudio(info.direction, info.fileName, info.url);
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.write('Done');
            response.end();
        });
    }
    else if (request.method == 'GET'){
        //Redirect function
        var split = request.url.split('/');
        console.log(split);
        console.log('Request url:', request.url);
        switch (request.url) {
             case '/': //'./index.html'
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.write('nothing');
                response.end();            
                break;
            case '/home':
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.write('Hello World!');
                response.end();
                break;
            default:
                if(split[1] == 'download'){
                    var temp = request.url.replace("/download", "");
                    ReturnDownLoadMp3File(temp, response);

                }else
                {
                    if(request.headers.range){
                        ReturnStreamMp3(request, response);
                      }else{
                        ReturnDownLoadMp3File(request.url, response);
                      }
                }
                break;
        }
    }
}
function ReturnStreamMp3(request, response){
    var path = '.' + request.url.toLowerCase();
    var filestream = fs.createReadStream(path);
    var range = request.headers.range.replace("bytes=", "").split('-');
    
    filestream.on('open', function() {
        var stats = fs.statSync(path);
      var fileSizeInBytes = stats["size"];
    
      // If the start or end of the range is empty, replace with 0 or filesize respectively
      var bytes_start = range[0] ? parseInt(range[0], 10) : 0;
      var bytes_end = range[1] ? parseInt(range[1], 10) : fileSizeInBytes;
    
      var chunk_size = bytes_end - bytes_start;
    
      if (chunk_size == fileSizeInBytes) {
        // Serve the whole file as before
        response.writeHead(200, {
          "Accept-Ranges": "bytes",
          'Content-Type': 'audio/mpeg',
          'Content-Length': fileSizeInBytes});
        filestream.pipe(response);
      } else {
        // HTTP/1.1 206 is the partial content response code
        response.writeHead(206, {
          "Content-Range": "bytes " + bytes_start + "-" + bytes_end + "/" + fileSizeInBytes,
          "Accept-Ranges": "bytes",
          'Content-Type': 'audio/mpeg',
          'Content-Length': fileSizeInBytes
        });
        filestream.pipe(response.slice(bytes_start, bytes_end));
      }
    });
}

function ReturnDownLoadMp3File(res, response){
    var path = '.' +res.toLowerCase();
    var filestream = fs.createReadStream(path);
    filestream.on('open', function() {
    var stats = fs.statSync(path);
    var fileSizeInBytes = stats["size"];
    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': fileSizeInBytes});
    filestream.pipe(response);
    });
}