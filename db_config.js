/**
 * Created by Stefan Aleksik on 25.7.2017.
 */
var mysql=require('mysql');
var connection=mysql.createPool({

    host:'',
    user:'',
    password:'',
    database:''

});
module.exports=connection;