/**
 * Created by Stefan Aleksik on 25.7.2017.
 */
var mysql=require('mysql');
var connection=mysql.createPool({

    host:'localhost',
    user:'stefan',
    password:'3162162as',
    database:'test'

});
module.exports=connection;