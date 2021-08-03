
const kafkaConsumer = require('../kafka/kafkaConsume');
// -= Mongo =-
const dataModel = require('../MongoAtlas/myMongo');
// --== BigML ==--
var bigModel = require('../bigML/bigML')

// -= Socket =-
 io = require("socket.io");
 ioClient = io(3003);

kafkaConsumer.consumer.on("data", function (m) {
  console.log("Recieved Message: ", m.value.toString());
  // console.log(m.value.toString()); 
  const obj = JSON.parse(m.value.toString());
  if (obj.action == "EnterRoad") {

    // carnum, section, prediction, type, day, hour, isspecial
    // section: obj.section, type: obj.type, day: obj.day, hour: obj.hour
    var pred = bigModel.MyBigML_Model_Prediction(obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);
    console.log(pred)
    obj.prediction = Math.round(pred);
    if (obj.prediction == 0 || obj.prediction == null) 
    {
      console.log("*****************Predicted is not generated yet...")
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
  else if (obj.action == "LeaveRoad") //obj.action == "LeaveRoad"
  {
    // need to find our prediction of leaved car from the car's entrance event and send it with the actual leaved section to dashboard
    // Need to findCar only if the prediction is completed
    dataModel.FindCarEvent(obj.carNum, obj.section, (data) => { ioClient.emit('car leaved', data) });
  }
});




