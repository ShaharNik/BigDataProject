
const kafkaConsumer = require('../kafka/kafkaConsume');
// -= mongo =-
const dataModel = require('../MongoAtlas/myMongo');
// --== BigML ==--
var bigModel = require('../bigML/bigML')

// -= Socket =-
const express = require('express'); // check id can delete
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);

kafkaConsumer.consumer.on("data", function (m) {
  console.log("Recieved Message: "); 
  //console.log(m.value.toString()); 
  const obj = JSON.parse(m.value.toString());
  //  console.log(obj.id);
  // console.log(obj.carNum); 
  //  console.log("===----====----===");
  if (obj.action == "EnterRoad" || obj.action == "LeaveRoad") {
    if (obj.action == "EnterRoad") {

      // carnum, section, prediction, type, day, hour, isspecial
      // section: obj.section, type: obj.type, day: obj.day, hour: obj.hour
      var pred = bigModel.MyBigML_Model_Prediction(obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);
      console.log(pred)
      obj.prediction = Math.round(pred);
      if (obj.prediction == 0 || obj.prediction == null) {
        console.log("Predicted is not updated yet !! !")
        console.log("Plaster was needed and activated"); // plaster
        if (obj.type == "Truck") {
            obj.prediction = 2;
          }
          else if (obj.type == "Private") {
            obj.prediction = 5;
          }
          else {
            obj.prediction = Math.floor(Math.random() * 5) + 1
          }
      }
      dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial, (data) => { ioClient.emit('car entered', data) });

    }
    else //obj.action == "LeaveRoad"
    {
      // need to find our prediction of leaved car from the car's entrance event and send it with the actual leaved section to dashboard
      // Need to findCar only if the prediction is completed
      dataModel.FindCarEvent(obj.carNum, obj.section, (data) => { ioClient.emit('car leaved', data) });
    }

  }
  });

//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    //socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
    //socket.on("NewEvent", (msg) => { //console.log(JSON.stringify(msg));
                                       //kafka.publish(msg) });
    socket.on("car entered", (predicted) => {
        //console.log("new car event arrived a app.js");
        io.emit('car entered', predicted)
        //socket.emit('car entered', predicted)
    })
    socket.on("car leaved", (predAndActual) => {
        io.emit('car leaved', predAndActual)
        //socket.emit('car leaved', predAndActual)
    })
    socket.on("accuracy", (acc) => { console.log("The accuracy is: " + acc) })
    socket.on("train data", () => dataModel.ReadEventsToCSV());

});


