const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3002;

app.set('view engine', 'ejs');
app.use(express.static("public"));

//------------ kafka------------
// const kafka = require('./Kafka/kafkaProduce');

// -==== Cold Way -====
const ColdWay = require('./ColdWay/ColdWayController');
app.get('/ConfusionMatrix', (req, res) => res.render('ConfusionMatrix'));
// -= Mongo =-
const dataModel = require('./MongoAtlas/myMongo');

// app.get('/ConfusionMatrix', (req, res) => res.render('ConfusionMatrix')); // CM instead of Sender
//------------ Socket.io ----------------
io.on("connection", (socket) => {
  console.log("new user connected");
  //socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
  //socket.on("NewEvent", (msg) => { //console.log(JSON.stringify(msg));
  //kafka.publish(msg) });
  socket.on("car entered", (predicted) => {
    //console.log("new car event arrived a app.js");
    io.emit('car entered', predicted)
    socket.emit('car entered', predicted)
  })
  socket.on("car leaved", (predAndActual) => {
    io.emit('car leaved', predAndActual)
    socket.emit('car leaved', predAndActual)
  })
  socket.on("accuracy", (acc) => { console.log("The accuracy is: " + acc) })
  socket.on("train data", () => dataModel.ReadEventsToCSV());

});

server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


