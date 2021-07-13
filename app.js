const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server)
const port = 3000

//------------ kafka------------
const kafka = require('./kafkaProduce');
const kafkaConsumer = require('./kafkaConsume');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//------------

app.set('view engine', 'ejs');
app.use(express.static("public"));

 //app.get('/', (req, res) => res.send("<a href='/send'>Send</a> <br/><a href=''>View</a>"));
 //app.get('/send', (req, res) => res.render('Sender')); // CM instead of Sender
 app.get('/', (req, res) => res.render('ConfusionMatrix')); // CM instead of Sender



//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
    socket.on("NewEvent", (msg) => { //console.log(JSON.stringify(msg));
                                        kafka.publish(msg) });
    socket.on("new car", (predicted) => {
        console.log("new car event arrived a app.js");
        io.emit('new car', predicted)
        socket.emit('new car', predicted)
    })
    socket.on("accuracy", (acc) => { console.log("The accuracy is: " + acc) });

});


//------------------- kafka -----------
/* Kafka Producer Configuration */

//
//const client1 = new kafka.KafkaClient({kafkaHost: "localhost:9092"});
//kafkaConsumer.consumer;




//------------------------------------


server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


