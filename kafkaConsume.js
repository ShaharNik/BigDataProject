// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

// -= mongo =-
const dataModel = require('./myMongo');
// --== BigML ==--
var bigml = require('bigml');
var bigModel = require('./bigML')

// -= Socket.io =-
//io = require("socket.io-client");
//ioClient = io.connect("http://localhost:3000");

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  // -= instance 1 =-
  //"metadata.broker.list": "glider-01.srvs.cloudkafka.com:9094,glider-02.srvs.cloudkafka.com:9094,glider-03.srvs.cloudkafka.com:9094".split(","),

  // -= instance 2 =-
  "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),

  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  // -= instance 1 =-
  //"sasl.username": "f3roe3re",
  //"sasl.password": "cDkjUdvtxxv4HZJmSAKLGzz7cdW6JpPV",

  // -= instance 2 =-
  "sasl.username": "25rvtceg",
  "sasl.password": "oh-CeZsSiWvmvN4g7-IswIgcTAR5d2Xt",

  "debug": "generic,broker,security"
};
// -= instance 1 =-
//const prefix = "f3roe3re-";

// -= instance 2 =-
const prefix = "25rvtceg-";
const topic = `${prefix}carsEvents`;
const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length, m);
//const prefix = process.env.CLOUDKARAFKA_USERNAME;

const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

consumer.on("error", function (err) {
  console.error(err);
});
consumer.on("ready", function (arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  console.log(`Consumer ${arg.name} consuming on topic:`, topic);
  consumer.consume();
});
//Recieving Data
consumer.on("data", function (m) {
  //console.log("Recieved Message: "); 
  //console.log(m.value.toString()); 
  const obj = JSON.parse(m.value.toString());
  //  console.log(obj.id);
  // console.log(obj.carNum); 
  //  console.log("===----====----===");
  if (obj.action == "EnterRoad" || obj.action == "LeaveRoad") {
    if (obj.action == "EnterRoad") {
      // var connection = new bigml.BigML('SHAHARNIK1',
      //   'e02260ed66f3dd2ef0f862bd9c7c27b6cab9d28a'
      // )
      // var source = new bigml.Source(connection);
      // source.create('./myDataEvents.csv', function (error, sourceInfo) {
      //   if (!error && sourceInfo) {
      //     var dataset = new bigml.Dataset(connection);
      //     dataset.create(sourceInfo, function (error, datasetInfo) { //section: obj.section, type: obj.type, day: obj.day, hour: obj.hour
      //       if (!error && datasetInfo) {
      //         var model = new bigml.Model(connection);
      //         model.create(datasetInfo, function (error, modelInfo) {
      //           if (!error && modelInfo) {
      //             var prediction = new bigml.Prediction(connection);
      //             prediction.create(modelInfo, { section: obj.section, type: obj.type, day: obj.day, hour: obj.hour }, function(error, pred){
      //               console.log(pred.object.output);
      //               obj.prediction = Math.round(pred.object.output);
      //               dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial, obj.outSection);
      //               //ioClient.emit('new car', {prediction: obj.prediction, actual: obj.outSection}) // need add obj.outSection
      //             })

      //             //console.log(prediction.prediction);
      //             //const localmodel = new bigml.LocalModel(prediction.resource, connection); //{"type":"Truck"}
      //             //localmodel.predict({ section: obj.section, type: obj.type, day: obj.day, hour: obj.hour }, function (error, pred) {
      //               //console.log(prediction); // TODO: Fix Bug: "Cannot read property 'prediction'""
      //               //obj.prediction = prediction.prediction;
      //               //console.log("obj.prediction: " + obj.prediction)
      //               //dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);
      //             //});
      //           }
      //         });
      //       }
      //     });
      //   }
      // });
      // carnum, section, prediction, type, day, hour, isspecial
      // section: obj.section, type: obj.type, day: obj.day, hour: obj.hour
      var pred = bigModel.MyBigML_Model_Prediction(obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);
      console.log(pred)
      obj.prediction = Math.round(pred);
      if (obj.prediction == 0) {
        console.log("Predicted is not updated yet !!")
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
      dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);
      // const localModel = new bigml.LocalModel('model/60f7d379cb4f96592d0d4475', connection);
      // localModel.predict({section: obj.section, type: obj.type, day: obj.day, hour: obj.hour},
      //   function (error, prediction) {
      //     // let pred = JSON.parse(prediction);
      //     // console.log("here: "+ pred)
      //     console.log("the prediction is: " + prediction.prediction)
      //     obj.prediction = prediction.prediction;
      //     console.log("obj.prediction: " + obj.prediction)
      //   });
      // Every Car of type Trunk leave at section 2
      // Every Car of type Private leave at at section 5
      //console.log("obj.prediction: " + obj.prediction) // need async waiting...

    }
    else //obj.action == "LeaveRoad"
    {
      // need to find our prediction of leaved car from the car's entrance event and send it with the actual leaved section to dashboard
      // Need to findCar only if the prediction is completed
      dataModel.FindCarEvent(obj.carNum, obj.section, (data) => { ioClient.emit('new car', data) });
    }

  }

});

consumer.on("disconnected", function (arg) {
  process.exit();
});
consumer.on('event.error', function (err) {
  console.error(err);
  process.exit(1);
});
consumer.on('event.log', function (log) {
  //console.log(log);
});
consumer.connect();

//module.exports.consumer = consumer;