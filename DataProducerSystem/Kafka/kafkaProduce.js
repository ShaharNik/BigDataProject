// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  // "metadata.broker.list": "glider-01.srvs.cloudkafka.com:9094,glider-02.srvs.cloudkafka.com:9094,glider-03.srvs.cloudkafka.com:9094".split(","),
  // "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094,dory-02.srvs.cloudkafka.com:9094,dory-03.srvs.cloudkafka.com:9094".split(","),
  "metadata.broker.list": "sulky-03.srvs.cloudkafka.com:9094,sulky-01.srvs.cloudkafka.com:9094,sulky-02.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  // "sasl.username": "f3roe3re",
  // "sasl.password": "cDkjUdvtxxv4HZJmSAKLGzz7cdW6JpPV",
  // "sasl.username": "25rvtceg",
  // "sasl.password": "oh-CeZsSiWvmvN4g7-IswIgcTAR5d2Xt",
  "sasl.username": "rfdvmgdr",
  "sasl.password": "780OQ1O45asS510VVMx-rK_HoCYcNxRh",
  "debug": "generic,broker,security"
};

// const prefix = "f3roe3re-";
// const prefix = "25rvtceg-";
const prefix = "rfdvmgdr-";


const topic = `${prefix}carsEvents`; // send to this topic
const producer = new Kafka.Producer(kafkaConf);
const myProducer = require('../simulator');

const genMessage = m => new Buffer.alloc(m.length, m);

producer.on("ready", function (arg) {
  console.log(`producer Ariel is ready.`);
  console.log("Activating simulator..")
  myProducer.GenerateData(publish2Kafka);
});
producer.connect();
//publish is a name can be any name...
// module.exports.publish= function(msg)
// {   
//   m=JSON.stringify(msg);
//   producer.produce(topic, -1, genMessage(m), uuid.v4());  //Send to KAFKA
//   //producer.disconnect();   
// }
function publish2Kafka(msg) {
  m = JSON.stringify(msg);
  producer.produce(topic, -1, genMessage(m), uuid.v4());  //Send to KAFKA
  //producer.disconnect();   
}
