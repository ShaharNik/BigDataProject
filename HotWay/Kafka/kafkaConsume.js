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
