var http = require('http');
var config = require('./config.json');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
const imagesFolder = config.resources;
const fs = require('fs');
const pandas = []

function handleRequest(request, response){
    try {
        console.log("Requested URL: " + request.url);
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

fs.readdir(imagesFolder, (err, files) => {
    files.forEach(file => {
      pandas.push(imagesFolder + '/' + file)
    });
})

dispatcher.onGet("/", function(req, res) {
    var randomPanda = pandas[Math.floor(Math.random() * pandas.length)];
    var img = fs.readFileSync(randomPanda);
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
});

dispatcher.onError(function(req, res) {
        res.writeHead(404);
        res.end("404 - Page Does not exists");
});

http.createServer(handleRequest).listen(config.port, function(){
    console.log("Server listening on: http://localhost:%s", config.port);
});
