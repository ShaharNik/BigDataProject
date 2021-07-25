const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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

consumer.on("disconnected", function (arg) {
  process.exit();
});
consumer.on('event.error', function (err) {
  console.error(err);
  process.exit(1);
});

consumer.connect();



module.exports.consumer = consumer;






// consumer.on("data", function (m) {
//   const obj = JSON.parse(m.value.toString());
//   if (obj.action == "EnterRoad" || obj.action == "LeaveRoad") {
//     if (obj.action == "EnterRoad") {
//       var pred = bigModel.MyBigML_Model_Prediction(obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);
//       console.log(pred)
//       obj.prediction = Math.round(pred);
//       if (obj.prediction == 0 || null) {
//         console.log("Predicted is not updated yet !!")
//         if (obj.type == "Truck") {
//           obj.prediction = 2;
//         }
//         else if (obj.type == "Private") {
//           obj.prediction = 5;
//         }
//         else {
//           obj.prediction = Math.floor(Math.random() * 5) + 1
//         }
//       }
//       dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.prediction, obj.type, obj.day, obj.hour, obj.isSpecial);

//     }
//     else
//     {
//       dataModel.FindCarEvent(obj.carNum, obj.section, (data) => { ioClient.emit('new car', data) });
//     }

//   }

// });


//module.exports.consumer = consumer;