const MongoClient = require('mongodb').MongoClient;
// החשבון שלי (שחר)
const uri = "mongodb+srv://shaharnik:Sn394491@cluster0.n5r39.mongodb.net/MyProjectDB?retryWrites=true&w=majority";
// -= Socket.io =-
//io = require("socket.io-client");
//ioClient = io.connect("http://localhost:3000");

sumHelper = function (numbers) { // פונקציה שמקבלת מספרים וסוכמת אותם
    let total = 0;
    numbers.forEach(numberObject => {
        let n = parseInt(numberObject.quantity);
        if (n)
            total += n;
    });
   
    return total;
}


/*
        var event= {};
        event.id = Math.floor(Math.random() * 10) + 1;//כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע
        event.section = Math.floor(Math.random() * 10) + 1; // מקטע
        event.type = "פרטי"; // private , מסחרי, משאית
        event.day = Math.floor(Math.random() * 8) + 1; // 1-7
        event.hour = "16:00";
        event.isSpecial = false;
        kafka.publish(event)
*/
var Db = {                                                          
    CreateEvent: function (action, carNum, section, prediction, type, day, hour, isSpecial) 
    {
        var newEvent =
        {
            action: action, carNum: carNum, section: section, prediction: prediction, type: type, day: day, hour: hour, isSpecial: isSpecial
        };
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("MyProjectDB");
            dbo.collection("transactions").insertOne(newEvent, function (err, res) {
                if (err) throw err;
                //console.log("1 order inserted to Mongo-Atlas");
                db.close();
            });
        });
    },
    FindCarEvent: function (carNum, LeavedSection, sendDataToDashbord) {
        console.log("77777  REACHED HERE !! 77777777")
        // https://docs.mongodb.com/drivers/node/usage-examples/findOne/
        //--------======= PROBLEM HERE ============---------
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            const dbo = db.db("MyProjectDB"); 
            const query = { carNum: carNum, action: "EnterRoad" }; // Find The Entrance Event of specific car
            const transactions = dbo.collection("transactions");
            const options = { projection: { prediction: 1}, };
            const result = transactions.findOne(query, options);
            console.log(result); 
            db.close();
        });
       //--------======= PROBLEM HERE ============---------
        //result.prediction; // The prediction when car entered road
        //LeavedSection; // The actual leaving Section
        //console.log("5555 REACHED HERE !! 555555")
        //sendDataToDashbord({prediction: result.prediction, actual: LeavedSection}); // נשלח ללמטריצה שלנו את מקטע החיזוי ומקטע היציאה בפועל
        // we found the entrance event of the specific car, so now we have the predicted value we predicted when the car entererd road,
        // and the actual section when the car has leaved the road.
    },
    DeleteOrder: function (info) {
        console.log('Delete Order: ' + info);
    },
    UpdateOrder: function (info) {
        console.log('Update Order ' + info);
    },
    ReadOrders: function (renderTheView) {
        var sum=0;
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("MyProjectDB"); // maybe here find leaving event
            dbo.collection("transactions").find({}, { projection: { _id: 0, quantity: 1 } }).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                sum = sumHelper(result);
                
                db.close();
                var cardData = {
                    id:"totalSum",
                    title: "אריאל",
                    totalSum: sum,
                    percent: 0.8,
                    icon: "work"
                };

                renderTheView(cardData);

            });
        });
       
        //כאן צריך לחשב
       

    }
};

module.exports = Db