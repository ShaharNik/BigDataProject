const kafkaConsumer = require('./Kafka/kafkaConsume');
const RedisReciver = require('./Redis/RedisReciver');
const RedisSender = require('./Redis/RedisSender');


consumer.on("data", function (m) {
    const obj = JSON.parse(m.value.toString());
    //update redis (if new car then insert redis else remove from redis)
    //active emit
  });


