io = require("socket.io-client");
ioClient = io.connect("http://localhost:3000");


module.exports.GenerateData= async function () 
{
    //await new Promise(resolve => setTimeout(resolve, 5000));
    var type = ['Private', 'Truck', 'Commercial']; // private , מסחרי, משאית   
    //const events = [];
    for (let i = 1; i <= 6; i++)
    {
        var event= {};
        event.id = Math.floor(Math.random() * 10) + 1;//כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע
        event.section = Math.floor(Math.random() * 10) + 1; // מקטע
        event.type = type[Math.floor(Math.random() * type.length)]; 
        event.day = Math.floor(Math.random() * 8) + 1; // 1-7
        event.hour = Math.round(Math.random()*24) + 1;
        event.isSpecial = Math.random() < 0.2; //20% probability of getting true;
        //console.log(JSON.stringify(event));
        //console.log("--------");
        //console.log(event);
        //events.push(JSON.parse(event));
        //kafka.publish(event)
        console.log(i + " msg created");
        ioClient.emit("callDetails",  event); // פה נשלח מידע לאיוונט בשם של הסוקט, הטיפול בו נמצא באפ והוא מדפיס את המידע לקונסול ושולח אותו לקאפקה
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
    }
}