const kafkaConsumer = require('../kafka/kafkaConsume');
//const RedisReciver = require('../Redis/RedisReciver');
//const RedisSender = require('../Redis/RedisSender');


kafkaConsumer.consumer.on("data", function (m) {
    const obj = JSON.parse(m.value.toString());
    //update redis (if new car then insert redis else remove from redis)
    //active emit
  });


