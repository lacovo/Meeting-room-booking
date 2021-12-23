var mysql = require('mysql');

//connect to mysql database from my own server
var connection = mysql.createConnection({
  host      : '116.12.63.162',
  user      : 'NhDdUPjdZn',
  password  : '8apK7TeDX7',
  database  : 'test',
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
