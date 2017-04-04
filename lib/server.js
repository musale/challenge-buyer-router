function createServer() {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');

    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

    // Connect to database
    var db = require('./db')

    // Accepts a JSON body representing a "buyer"
    app.post('/buyers', function(req, res) {
      if (req.body) {
        var buyers = JSON.stringify(req.body)
        db.get().sadd(`buyers`, `${buyers}`)
        res.status(201).json(req.body)
      } else {
          res.status(200).json("{'invalid': json")
      }
    });

    // Retrieves a "buyer" document by :id
    app.get('/buyers/:id', function(req, res) {
      let id = req.params.id
      db.get().smembers("buyers", function(err, buyer) {
          buyer.map(function(offer) {
              var data = JSON.parse(offer)
              if (id == data.id) {
                res.status(200).send(data);
              }

          })
      })
    });

    // Compares a request object to the offers of the "buyers" and route traffic to the highest valued matching location
    app.get('/route', function(req, res) {

    });

    //
    var server = app.listen(3000, function() {
        var port = server.address().port;
        db.connect()
    });
    return server;
}
module.exports = createServer

if (require.main === module) {
    module.exports().listen(3000, function(err) {
        console.log('Server started on port %d', 3000)
    })
}
