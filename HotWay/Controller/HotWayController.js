// io = require("socket.io");
// ioServer = io(65530);

const kafkaConsumer = require('../kafka/kafkaConsume');
const RedisReciver = require('../Model/RedisReciver');
const RedisSender = require('../Model/RedisSender');

kafkaConsumer.consumer.on("data", function (m) {
  console.log("Get new message from kafka");
  const obj = JSON.parse(m.value.toString());
  if (obj.action == "EnterSection" || obj.action == "LeaveSection") {
    updateSections(obj);
    RedisReciver.GetSectionsCarNumbers(obj.section);
  }

});

function updateSections(obj) {

  switch (obj.action) {
    case "EnterSection":
      RedisSender.CarEnterSection(obj.carNum, obj.section);
      break;
    case "LeaveSection":
      // RedisSender.CarLeaveSection(obj.carNum);
      break;
  }
}