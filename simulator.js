
module.exports.GenerateData= function (kafka) 
{
    for (let i = 0; i < 10; i++)
    {
        var event= {};
        event.id = Math.floor(Math.random() * 10) + 1;//כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע
        event.section = Math.floor(Math.random() * 10) + 1; // מקטע
        event.type = "פרטי"; // private , מסחרי, משאית
        event.day = Math.floor(Math.random() * 8) + 1; // 1-7
        event.hour = "16:00";
        event.isSpecial = false;
        //kafka.publish(event)
        //socket.emit("callDetails", message); // פה נשלח מידע לאיוונט בשם של הסוקט, הטיפול בו נמצא באפ והוא מדפיס את המידע לקונסול ושולח אותו לקאפקה
    }
}