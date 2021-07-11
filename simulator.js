io = require("socket.io-client");
ioClient = io.connect("http://localhost:3000");


module.exports.GenerateData= async function () 
{
    //await new Promise(resolve => setTimeout(resolve, 5000));
    var type = ['Private', 'Truck', 'Commercial']; // private , מסחרי, משאית 
    //var action = ['EnterRoad', 'LeaveRoad', 'EnterSection', 'LeaveSection']; //כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע   
    //var actionEnter = ['EnterRoad', 'EnterSection']; //כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע 
    //var actionLeave = ['LeaveRoad', 'LeaveSection']; //כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע 
    //var SectionsCounters = [0, 0, 0, 0, 0]; // count how many vehicles on each section
    var VehiclesOnRoadCounter = 0;
    const Enterevents = [];
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
    for (let i = 0; i < 10; i++)
    {
        var event= {};
        event.CarNumber = Math.floor(10000000 + Math.random() * 90000000); // 8 digot number
        event.action = "EnterRoad"; // Car can't leave if not entered...!!!
        event.section = 0;
        VehiclesOnRoadCounter++;
        event.type = type[Math.floor(Math.random() * type.length)]; 
        event.day = Math.floor(Math.random() * 8) + 1; // 1-7
        event.hour = Math.round(Math.random()*24) + 1;
        event.isSpecial = Math.random() < 0.2; //20% probability of getting true;

        Enterevents.push(event);

        console.log(i + " vehicle enter to road in hour: " + event.hour);
        ioClient.emit("callDetails",  event); // פה נשלח מידע לאיוונט בשם של הסוקט, הטיפול בו נמצא באפ והוא מדפיס את המידע לקונסול ושולח אותו לקאפקה
        //await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
    }
    console.log(VehiclesOnRoadCounter + " Vehicles on road");
    for (let i = 0; i < 10; i++)
    {
        if (Math.random() < 0.2) // 20% probability of getting true;
        {
            // Generate Leave Road event, without entering any section
            var rndCar = Math.floor(Math.random() * Enterevents.length);
            Enterevents[rndCar].action = "LeaveRoad"; // cange action to leave road
            var entranceHour = Enterevents[rndCar].hour;
            Enterevents[rndCar].hour = Math.round(Math.random()*24) + entranceHour; // update leave road hour
            VehiclesOnRoadCounter--;
            ioClient.emit("callDetails",  Enterevents[rndCar]);
            console.log("Vehicle " + i + " Leaved Road");
        }
    }

    console.log(VehiclesOnRoadCounter + " Left on road, The others Leaved Road");
    // around 20% of vehicles leaved the road.
    // the other vehicles enter to sections
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
    for (let i = 0; i < Enterevents.length; i++) 
    {
        if (Enterevents[i].action.localeCompare("EnterRoad") == 0) // Enter the un-leaved cars into sections
        {
            Enterevents[i].action = "EnterSection";
            Enterevents[i].section = Math.floor(Math.random() * 6) + 1; // 1-5 מקטע
            var entranceHour = Enterevents[i].hour;
            Enterevents[i].hour = Math.round(Math.random()*24) + entranceHour; // update enter section hour
            ioClient.emit("callDetails",  Enterevents[i]);
            console.log("Vehicle " + i + " Entered Section: " + Enterevents[i].section);
            Enterevents[i].hour = entranceHour; // want to predict with this
        }
    }
    // All the vehicles leaved the road or entered a section
    // When vehicle enter to road, we need to predict the section he will leave.
    // We need to choose on which section a vehicle will leave, and give some pattern that we will predict.
    // - Every Car enter between hour 6-8 have 90% change to leave at section 2
    // - Every Car enter between hour 16-18 have 90% change to leave at section 5
    for (let i=0; i < Enterevents.length; i++)
    {
        if (Enterevents[i].action.localeCompare("EnterSection") == 0) // Choose a leaving section for cars driving in section
        {
            Enterevents[i].action = "LeaveSection";
            // -== Here we random the actual leaving Section of vehicle ! ==-
            if (Enterevents[i].hour >= 8 && Enterevents[i].hour <= 11) // 08:00 - 11:00 -> Section 2
            {
                Enterevents[i].section = 2; // maybe add prob of 90% instead of 100%
                Enterevents[i].hour = Math.round(Math.random()*24) + entranceHour; // update enter section hour

            }
            else if (Enterevents[i].hour >= 17 && Enterevents[i].hour <= 19) // 17:00 - 19:00 -> Section 5
            {
                Enterevents[i].section = 5; // add prob of 90%
                Enterevents[i].hour = Math.round(Math.random()*24) + entranceHour; // update enter section hour
            }
            else
            {
                Enterevents[i].section = Math.floor(Math.random() * 6) + 1; // 1-5 מקטע
                Enterevents[i].hour = Math.round(Math.random()*24) + entranceHour; // update enter section hour
            }
            console.log("Vehicle " + i + " Leaved Section: " + Enterevents[i].section);
            ioClient.emit("callDetails",  Enterevents[i]);
        }
    }
    // add leaving events or enter another section again


}