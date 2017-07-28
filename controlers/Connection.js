/**
 * Created by Stefan Aleksik on 25.7.2017.
 */
var db = require('../db_config');

var Connection={

    getData:function(callback){
        return db.query("SELECT * FROM sample_table2",callback);
        //console.log(db.query("SELECT TAK FROM sample_table2"))
    }};

module.exports=Connection;