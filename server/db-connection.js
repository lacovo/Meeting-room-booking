var mysql = require('mysql');

//connect to mysql database from my own server
var connection = mysql.createConnection({
  host      : 'sql6.freemysqlhosting.net',
  user      : 'sql6464593',
  password  : 'XGwZM5s8ng',
  database  : 'sql6464593',
});
connection.connect(function(err){
  (err) ? console.log(err): console.log('connected');
});

module.exports=function(){
  if (!connection){
    connection;
  }
  return connection;
};
