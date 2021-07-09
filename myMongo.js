const MongoClient = require('mongodb').MongoClient;
// החשבון שלי (שחר)
const uri = "mongodb+srv://shaharnik:Sn394491@cluster0.n5r39.mongodb.net/MyProjectDB?retryWrites=true&w=majority";

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
var Db = {                                                          //sendDataTo Dashboard func deleted
    CreateOrder: function (id, section, type, day, hour, isSpecial) {
        var newOrder =
        {
            id: id, section: section, type: type, day: day, hour: hour, isSpecial: isSpecial
        };
        //---------choose your db here ------------------
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("MyProjectDB");
            dbo.collection("transactions").insertOne(newOrder, function (err, res) {
                if (err) throw err;
                console.log("1 order inserted");
                db.close();
            });
        });

        //---------------------------------------
        //כאן צריך להחליט מה מחזירים לצד לקוח ולהפעיל את הלוגיקה הנדרשת
        // אולי נרצה לעדכן עוד אלמנטים בדף נניח ממוצעים גרף וכו, יש לעדכן את האובייקט הנשלח
        // sendDataToDashbord = (function): (data)=>{io.emit('new data',data);
        //sendDataToDashbord({elementId:"totalSum",value:Math.random() * 1000});
       
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
            var dbo = db.db("MyProjectDB");
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