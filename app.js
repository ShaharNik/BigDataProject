const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));

//------------ kafka------------
const kafka = require('./Kafka/kafkaProduce');

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
const ColdWay = require('./ColdWay/ColdWayController');
app.get('/', (req, res) => res.render('ConfusionMatrix')); // CM instead of Sender

server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


