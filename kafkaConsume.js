// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

// -= mongo =-
const dataModel = require('./myMongo');
// --== BigML ==--
var bigml = require('bigml');

// -= Socket.io =-
//io = require("socket.io-client");
//ioClient = io.connect("http://localhost:3000");

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "glider-01.srvs.cloudkafka.com:9094,glider-02.srvs.cloudkafka.com:9094,glider-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "f3roe3re",
  "sasl.password": "cDkjUdvtxxv4HZJmSAKLGzz7cdW6JpPV",
  "debug": "generic,broker,security"
};

const prefix = "f3roe3re-";
const topic = `${prefix}myTest`;
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
  //  console.log(obj.section);
  //  console.log(obj.type);
  //  console.log(obj.day);
  //  console.log(obj.hour);
  //  console.log(obj.isSpecial);
  //  console.log("===----====----===");
  if (obj.action == "EnterRoad" || obj.action == "LeaveRoad") 
  {
    if (obj.action == "EnterRoad") 
    {
      var connection = new bigml.BigML('SHAHARNIK1',
        'e02260ed66f3dd2ef0f862bd9c7c27b6cab9d28a'
      )

      var source = new bigml.Source(connection);
      source.create('./myDataEvents.csv', function (error, sourceInfo) {
        if (!error && sourceInfo) {
          var dataset = new bigml.Dataset(connection);
          dataset.create(sourceInfo, function (error, datasetInfo) {
            if (!error && datasetInfo) {
              var model = new bigml.Model(connection);
              model.create(datasetInfo, function (error, modelInfo) {
                if (!error && modelInfo) {
                  var prediction = new bigml.Prediction(connection);
                  prediction.create(modelInfo, {section: obj.section, type: obj.type, day: obj.day, hour: obj.hour})
                  const localmodel = new bigml.LocalModel(prediction.resource, connection);
                  localmodel.predict({section: obj.section, type: obj.type, day: obj.day, hour: obj.hour}, function (error, prediction) {
                    console.log(prediction.prediction); // TODO: Fix Bug: "Cannot read property 'prediction'""
                    //obj.prediction = prediction.prediction;
                    //console.log("obj.prediction: " + obj.prediction)
                    //dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);
                  });
                }
              });
            }
          });
        }
      });
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