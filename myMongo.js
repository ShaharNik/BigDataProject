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
    CreateEvent: function (action, carNum, section, predicted, type, day, hour, isSpecial, sendDataToDashbord) 
    {
        var newEvent =
        {
            action: action, carNum: carNum, section: section, predicted: predicted, type: type, day: day, hour: hour, isSpecial: isSpecial
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

        //---------------------------------------
        //כאן צריך להחליט מה מחזירים לצד לקוח ולהפעיל את הלוגיקה הנדרשת
        // אולי נרצה לעדכן עוד אלמנטים בדף נניח ממוצעים גרף וכו, יש לעדכן את האובייקט הנשלח
        // כאן אשלח את המקטע שממנו יצא רכב
        // sendDataToDashbord = (function): (data)=>{io.emit('new car',data);

        //const action = JSON.parse(action);
        if (action == "LeaveRoad") // if the car leaved road, we send the section he actually leaved
        {
            //var EntranceEventOfCar = this.FindCarEvent(carNum); // should get The Entrance event of this specific car that leaved road.
            //var ActuaEntranceEventOfCar.section
            sendDataToDashbord({pred:predicted,actual:section}); // נשלח ללמטריצה שלנו את מקטע החיזוי ומקטע היציאה בפועל
        }

    },
    FindCarEvent: function (carNum) {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("MyProjectDB"); // Find The Enrance Event of specific car
            var query = { carNum: carNum, action: "EnterRoad" };
            dbo.collection("transactions").findOne({query}, { projection: { carNum: carNum, action: "EnterRoad", section: section } })(function (err, result) {
                if (err) throw err;
                console.log(result); //need return result
                
                db.close();
                // var cardData = {
                //     id:"totalSum",
                //     title: "אריאל",
                //     totalSum: sum,
                //     percent: 0.8,
                //     icon: "work"
                // };
                // renderTheView(cardData);

            });
        });
       
        //כאן צריך לחשב
    
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