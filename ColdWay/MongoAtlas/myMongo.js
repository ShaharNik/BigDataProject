const MongoClient = require('mongodb').MongoClient;
// החשבון שלי (שחר)
const uri = "mongodb+srv://shaharnik:Sn394491@cluster0.n5r39.mongodb.net/MyProjectDB?retryWrites=true&w=majority";

// --== File System ==--
var fs = require('fs');


var Db = {
    CreateEvent: function (action, carNum, section, prediction, type, day, hour, isSpecial, sendPredToDashboard) {
        var newEvent =
        {
            action: action, carNum: carNum, section: section, prediction: prediction, type: type, day: day, hour: hour, isSpecial: isSpecial
        };
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("MyProjectDB");
            dbo.collection("transactions").insertOne(newEvent, function (err, res) {
                if (err) throw err;
                console.log("1 order inserted to Mongo-Atlas");
                db.close();
            });
        });
        sendPredToDashboard({ prediction: prediction, carNum: carNum });
    },
    FindCarEvent: function (carNum, LeavedSection, sendDataToDashbord) {
        // https://docs.mongodb.com/drivers/node/usage-examples/findOne/
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            const dbo = db.db("MyProjectDB");
            const query = { carNum: carNum, action: "EnterRoad" }; // Find The Entrance Event of specific car
            const transactions = dbo.collection("transactions");
            const options = { projection: { prediction: 1 }, };
            //const result = transactions.findOne(query, options).then(result => sendDataToDashbord({prediction: result.prediction, actual: LeavedSection}); db.close());
            transactions.find(query).toArray((err, result) => {
                if (err) throw err;
                if (result[0] != null) {
                    var predictedSection = 0;
                    if (result[0].hasOwnProperty('prediction')) 
                    {
                        predictedSection = result[0].prediction;
                    }
                    else 
                    {
                        console.log("Predicted is not generated yet...");
                        if (result[0].type == "Truck") {
                            result[0].prediction = 2;
                        }
                        else if (result[0].type == "Private") {
                            result[0].prediction = 5;
                        }
                        else {
                            result[0].prediction = Math.floor(Math.random() * 5) + 1
                        }
                    }
                    console.log("Sending data to dashborad")
                    sendDataToDashbord({ prediction: predictedSection, actual: LeavedSection, carNum: carNum });
                }
                else
                {
                    console.log("Predicted is not generated yet...")
                }
                //db.close();
            })
            // ---==== Add The Actual Leaved Section of Car ====-----
            const UpdQuery = { carNum: carNum, action: "EnterRoad" };
            const newvalue = { $set: { outSection: LeavedSection } };
            transactions.updateOne(UpdQuery, newvalue, function (err, res) {
                if (err) throw err;
                console.log("out section updated for leaved car");
                db.close();
            });

        });
        //result.prediction; // The prediction when car entered road
        //LeavedSection; // The actual leaving Section
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
    ReadEventsToCSV: function () {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("MyProjectDB");
            dbo.collection("transactions").find({}, { projection: { _id: 0, action: 0, carNum: 0 } }).toArray(function (err, result) {
                if (err) throw err;
                //console.log(result);
                JSONtoCSV(result);
                db.close();
            });
        });
    }
};
function JSONtoCSV(data) {
    const fileName = './myDataEvents.csv';
    csv = data.map(row => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    if (fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, csv.join('\n'), 'utf8')
        console.log("Data Have been saved us CSV")
    }
    else // if CSV not exist, create one
    {
        fs.open("myDataEvents.csv", 'w', function (err, file) {
            if (err) throw err;
            console.log('New CSV file has been created');
            fs.writeFileSync(fileName, csv.join('\n'), 'utf8')
            console.log("Data Have been saved us CSV")
        });
    }
}

module.exports = Db