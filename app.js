const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

//------------ kafka------------
const kafka = require('./kafkaProduce');
// const kafkaConsumer = require('./Kafka/kafkaConsume');

// ---==== Mongo ===----
const dataModel = require('./myMongo');

// const redisReceiver = require('./Model/RedisForArielReciver');
// const redisSender = require ('./Model/RedisForArielSender');
// const redisConnect = require ('./RedisConnector/RedisNode');



// -==== Hot way ====-
const HotWay = require('./HotWay/HotWayController');
//TODO : insert all logic to another file
app.get('/Dashboard', (req, res) => res.render('Dashboard', {
    data: {
        sections: [
            {
                Id: "totalSum",
                SectionTitle: "מקטע 1",
                Cars: 100
            },
            {
                Id: "totalSum",
                SectionTitle: "מקטע 2",
                Cars: 200
            },
            {
                Id: "totalSum",
                SectionTitle: "מקטע 3",
                Cars: 300
            },
            {
                Id: "totalSum",
                SectionTitle: "מקטע 4",
                Cars: 400
            },
            {
                Id: "totalSum",
                SectionTitle: "מקטע 5",
                Cars: 500
            }

        ]
    }
}));
// ---==== GET URL ===----
//app.get('/', (req, res) => res.send("<a href='/send'>Send</a> <br/><a href=''>View</a>"));
// app.get('/send', (req, res) => res.render('Sender'));


// app.get('/Dashboard', (req, res) => {
//     dataModel.ReadOrders((card) => { res.render("Dashboard", { Titles: ['מקטע 5', 'מקטע 4', 'מקטע 3', 'מקטע 2', 'מקטע 1',] }) });

// })


// -==== Cold Way -====
app.get('/', (req, res) => res.render('ConfusionMatrix')); // CM instead of Sender


//TODO : remove socket.io from here
//------------ Socket.io ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { console.log(msg.totalWaiting) });
    //socket.on("NewEvent", (msg) => { //console.log(JSON.stringify(msg));
                                       //kafka.publish(msg) });
    socket.on("car entered", (predicted) => {
        //console.log("new car event arrived a app.js");
        io.emit('car entered', predicted)
        //socket.emit('car entered', predicted)
    })
    socket.on("car leaved", (predAndActual) => {
        io.emit('car leaved', predAndActual)
        //socket.emit('car leaved', predAndActual)
    })
    socket.on("accuracy", (acc) => { console.log("The accuracy is: " + acc) })
    socket.on("train data", () => dataModel.ReadEventsToCSV());

});


//------------------- kafka -----------
/* Kafka Producer Configuration */

//
//const client1 = new kafka.KafkaClient({kafkaHost: "localhost:9092"});
//kafkaConsumer.consumer;




//------------------------------------


server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


