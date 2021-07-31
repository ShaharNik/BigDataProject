const express = require('express');
const app = express();
var server = require('http').createServer(app);
const port = 3000;

//------------ kafka------------
const kafka = require('./Kafka/kafkaProduce');

server.listen(port, () => console.log(`Data Producer System app listening at http://localhost:${port}`));


