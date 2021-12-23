const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const  db = require('../db-connection');
const connection = db();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function(req, res) {
  const orderBy = req.query.orderby === "default" ? "date, starttime" : req.query.orderby;
  let condition = [];
  let query = "";
  req.query.id === "" ? "" : condition.push(`roomid = ${req.query.id}`);
  req.query.name === "" ? "" : condition.push(`roomname = '${req.query.name}'`);
  console.log(condition.length);
  req.query.date === "" ? (req.query.isall === "true" ? "" : condition.push("date >= CURDATE()")) : condition.push(`date = '${req.query.date}'`);
  console.log(condition.length);
  req.query.host === "" ? "" : condition.push(`host like '%${req.query.host}%'`);
  req.query.guest === "" ? "" : condition.push(`guest like '%${req.query.guest}%'`);
  if( condition.length > 0 ) {
    condition.forEach((item)=>{
      query += item + " and ";
    })

    query = "where " + query.substring(0, query.length-5);
  }
  console.log(query);
  connection.query(`SELECT * FROM bookinfo ${query} ORDER BY ${orderBy}`, (err, results) => {
    if(err) {
      return res.send(err)
    }
    else {
      return res.send(results)
    }
  });
});

router.get('/room', function(req, res) {

  const id = req.query.roomid;
  if( id !== "" ) {
    const Book_Query = `SELECT * FROM bookinfo where roomname = '${id}' ORDER BY date, starttime`;

    connection.query(Book_Query, (err, bookResult) => {
      if(err) {
        return res.send(err)
      }
      else { 
        return res.send(bookResult)
      }
    });
  } else if( id === "" ) {
    const Room_Query = `SELECT * FROM rooms`;
    connection.query(Room_Query, (err, results) => {
        if(err) {
          return res.send(err)
        }
        else {
          return res.send(results)
        }
      });
  }

});

router.post('/save', function(req, res){
  const name = req.body.roomname;
  const id = req.body.bookid;
  const host = req.body.host;
  const guests = req.body.guests;
  const date = req.body.date;
  const startTime = req.body.starttime;
  const finishTime = req.body.finishtime;
  let INSERT_QUERY = `INSERT INTO bookinfo (roomname,roomid,host,guests,date,starttime,finishtime) VALUES ('${name}','','${host}','${guests}','${date}','${startTime}','${finishTime}')`;
  if(id === "0") {
    INSERT_QUERY = `UPDATE table_name SET roomname='${name}', host='${host}', guests='${guests}', date='${date}', starttime='${startTime}', finishtime='${finishTime}'  where bookid = '${id}'`
  }
  connection.query(INSERT_QUERY, (err) => {
    if(err) {
      return res.end(err)  
    }
    else{
      return res.send({'info': 'Successfully saved booking'})
    } 
  })
});

router.post('/delete', function(req, res){
  const bookid = req.body.bookid;
  console.log(req.body);
  const DELETE_QUERY = `DELETE FROM bookinfo where bookid in (${bookid})`;
  console.log(DELETE_QUERY);
  connection.query(DELETE_QUERY, (err) => {
    if(err) {
      return res.end(err)  
    }
    else{
      console.log('successfully deleted booking');
      return res.send({'info': 'Successfully deleted booking'})
    } 
  })
});

module.exports = router;

