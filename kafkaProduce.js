// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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
const topic = `${prefix}myTest`; // send to this topic
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
