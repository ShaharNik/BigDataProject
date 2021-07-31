const express = require('express');
const app = express();
var server = require('http').createServer(app);
const port = 3001;

app.set('view engine', 'ejs');
app.use(express.static("public"));

const HotWay = require('./Controller/HotWayController');
const data = {
    sections: [
        {
            Id: "section1",
            SectionTitle: "מקטע 1"
        },
        {
            Id: "section2",
            SectionTitle: "מקטע 2"
        },
        {
            Id: "section3",
            SectionTitle: "מקטע 3"
        },
        {
            Id: "section4",
            SectionTitle: "מקטע 4"
        },
        {
            Id: "section5",
            SectionTitle: "מקטע 5"
        }
    ]
};
app.get('/', (req, res) => res.render('Dashboard', data));

server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));


