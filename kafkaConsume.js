// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

// -= mongo =-
const dataModel = require('./myMongo');
const bigml = require("bigml");

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

const genMessage = m => new Buffer.alloc(m.length,m);
//const prefix = process.env.CLOUDKARAFKA_USERNAME;

const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

consumer.on("error", function(err) {
  console.error(err);
});
consumer.on("ready", function(arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  console.log(`Consumer ${arg.name} consuming on topic:`, topic);
  consumer.consume();
});
//Recieving Data
consumer.on("data", function(m) { //WHY STOPPED REACHING HERE?
 //console.log("Recieved Message: "); 
 //console.log(m.value.toString()); 
 // id, section, type, day, hour, isSpecial, sendDataToDashbord
 const obj = JSON.parse(m.value.toString());
//  console.log(obj.id);
// console.log(obj.carNum); 
//  console.log(obj.section);
//  console.log(obj.type);
//  console.log(obj.day);
//  console.log(obj.hour);
//  console.log(obj.isSpecial);
//  console.log("===----====----===");
if (obj.action == "EnterRoad")
{
   // obj.predicted = bigML; // NEED TO Predict the section here
   obj.predicted = Math.floor(Math.random() * 5) + 1; // 1-5 מקטע
}
                                                                                               //, (data)=>{io.emit('new car',data)}
 dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.predicted, obj.type, obj.day, obj.hour, obj.isSpecial, (data)=>{ioClient.emit('new car',data)});
});

consumer.on("disconnected", function(arg) {
  process.exit();
});
consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});
consumer.on('event.log', function(log) {
  //console.log(log);
});
consumer.connect();

//module.exports.consumer = consumer;