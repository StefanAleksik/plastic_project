var express = require('express');
var router = express.Router();
var connection = require('../controlers/Connection');
/* GET home page. */
router.get('/', function(req, res) {
  connection.getData(function (err, data) {
    if(err){
    res.render('index', { title: 'Express', pass: 'body' });
    console.log(err)
    }
    else {
        var string = JSON.stringify(data);
        var json =  JSON.parse(string);
        res.render('index', { title: 'Express', pass: 'body', data: json });
        console.log('here: ' + json)
    }

  });
router.get('/data', function (req, res) {
    connection.getData((function (err, data) {
        if(err){
            res.send(err)
        }
        else {
            var string = JSON.stringify(data);
            var json =  JSON.parse(string);
            res.send(json)
        }
    }))
})

});

module.exports = router;
