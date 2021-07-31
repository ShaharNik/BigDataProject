const kafkaConsumer = require('../kafka/kafkaConsume');
const RedisReciver = require('../Model/RedisReciver');
const RedisSender = require('../Model/RedisSender');

kafkaConsumer.consumer.on("data", function (m) {
  console.log("Get new message from kafka");
  const obj = JSON.parse(m.value.toString());
  updateSections(obj);

  //get numbers from redis and send them to dashboard
  updateDashboard();
});

function updateSections(obj) {

  switch (obj.action) {
    case "EnterSection":
      console.log('updateSections-EnterSection')
      RedisSender.CarEnterSection(obj.carNum, obj.section);
      break;
    case "LeaveSection":
      console.log('updateSections-LeaveSection')
      RedisSender.CarLeaveSection(obj.carNum);
      break;
  }
}

function updateDashboard() {
  const result = RedisReciver.GetSectionsCarNumbers();

}

