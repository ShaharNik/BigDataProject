// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

// -= mongo =-
const dataModel = require('./myMongo')

// -= Socket.io =-
io = require("socket.io-client");
ioClient = io.connect("http://localhost:3000");

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "glider-01.srvs.cloudkafka.com:9094,glider-02.srvs.cloudkafka.com:9094,glider-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "2j37lih9",
  "sasl.password": "4SY0DEv9KIvpSCW9cXgkry1SCUVuPqUL",
  "debug": "generic,broker,security"
};

const prefix = "2j37lih9-";
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
consumer.on("data", function(m) {
 console.log("Recieved Message: "); 
 console.log(m.value.toString()); 
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
// -== Need To transmit the actual leaving Section of vehicle ! ==-
 // sendDataToDashbord = (data)=>{io.emit('new data',data)}
 dataModel.CreateEvent(obj.action, obj.carNum, obj.section, obj.type, obj.day, obj.hour, obj.isSpecial, (data)=>{io.emit('new car',data);});
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