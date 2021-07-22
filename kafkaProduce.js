// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

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

const topic = `${prefix}carsEvents`; // send to this topic
const producer = new Kafka.Producer(kafkaConf);
const myProducer = require('./simulator');

const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
  console.log(`producer Ariel is ready.`);
  console.log("Activating simulator..")
  myProducer.GenerateData();
});
producer.connect();
//publish is a name can be any name...
module.exports.publish= function(msg)
{   
  m=JSON.stringify(msg);
  producer.produce(topic, -1, genMessage(m), uuid.v4());  //Send to KAFKA
  //producer.disconnect();   
}
