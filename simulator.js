io = require("socket.io-client");
ioClient = io.connect("http://localhost:3000");


module.exports.GenerateData= async function () 
{
    const minWait = 300;
    const maxWait = 600;
    const MaxEvents = 10;

    var type = ['Private', 'Truck', 'Commercial']; // private , מסחרי, משאית 
    var VehiclesOnRoadCounter = 0;
    const Enterevents = [];
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
    // --== Enter Cars To The Road ==---
    for (let i = 0; i < MaxEvents; i++)
    {
        var event= {};
        event.carNum = Math.floor(10000000 + Math.random() * 90000000); // 8 digit number
        event.action = "EnterRoad"; // Car can't leave if not entered..
        event.section = 0;
        event.prediction = 0;
        VehiclesOnRoadCounter++;
        event.type = type[Math.floor(Math.random() * type.length)]; 
        event.day = Math.floor(Math.random() * 8) + 1; // 1-7
        event.hour = Math.floor(Math.random()*24) + 1;
        event.isSpecial = Math.random() < 0.2; //20% probability of getting true;

        Enterevents.push(event);

        console.log(i + " vehicle enter to road in hour: " + event.hour);
        ioClient.emit("NewEvent",  event); // פה נשלח מידע לאיוונט בשם של הסוקט, הטיפול בו נמצא באפ והוא מדפיס את המידע לקונסול ושולח אותו לקאפקה
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
    }
    console.log(VehiclesOnRoadCounter + " Vehicles on road");


    // for (let i = 0; i < MaxEvents; i++)
    // {
    //     if (Math.random() < 0.2) // 20% probability of getting true;
    //     {
    //         // 0.2% to Generate Leave Road event for car without entering any section
    //         var rndCar = Math.floor(Math.random() * Enterevents.length);
    //         Enterevents[rndCar].action = "LeaveRoad"; // change action to leave road
    //         var entranceHour = Enterevents[rndCar].hour;
    //         newHour = Math.round(Math.random()*24) + entranceHour;
    //         if (newHour > 24)
    //             newHour = 24;
    //         Enterevents[rndCar].hour = newHour;
    //         VehiclesOnRoadCounter--;
    //         ioClient.emit("NewEvent",  Enterevents[rndCar]);
    //         console.log("Vehicle " + i + " Leaved Road");
    //     }
    //     await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
    // }

    // console.log(VehiclesOnRoadCounter + " Left on road, The others Leaved Road");
    // // around 20% of vehicles leaved the road.
    // // the other vehicles enter to sections
    // await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));



    for (let i = 0; i < Enterevents.length; i++) 
    {
        if (Enterevents[i].action.localeCompare("EnterRoad") == 0) // Enter the un-leaved cars into sections
        {
            Enterevents[i].action = "EnterSection";
            Enterevents[i].section = Math.floor(Math.random() * 5) + 1; // 1-5 מקטע
            var entranceHour = Enterevents[i].hour;
            var newHour = Math.floor(Math.random()*24) + entranceHour;
            if (newHour > 24)
                newHour = 24;
            Enterevents[i].hour = newHour; // update enter section hour
            ioClient.emit("NewEvent",  Enterevents[i]);
            console.log("Vehicle " + i + " Entered Section: " + Enterevents[i].section);
            Enterevents[i].hour = entranceHour; // want to predict with this
        }
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
    }
    // All the vehicles leaved the road or entered a section
    // When vehicle enter to road, we need to predict the section he will leave.
    // We need to choose on which section a vehicle will leave, and give some pattern that we will predict.
    // - Every Car enter between hour 6-8 have 90% chance to leave at section 2
    // - Every Car enter between hour 16-18 have 90% chance to leave at section 5
    for (let i=0; i < Enterevents.length; i++)
    {
        if (Enterevents[i].action.localeCompare("EnterSection") == 0) // Choose a leaving section for cars driving in section
        {
            Enterevents[i].action = "LeaveSection";
            // -== Here we random the actual leaving Section of vehicle ! ==-
            if (Enterevents[i].hour >= 8 && Enterevents[i].hour <= 11) // 08:00 - 11:00 -> Section 2
            {
                Enterevents[i].section = 2; // maybe add prob of 90% instead of 100%
                var newHour = Math.floor(Math.random()*24) + entranceHour;
                if (newHour > 24)
                    newHour = 24;
                Enterevents[i].hour = newHour; // update enter section hour

            }
            else if (Enterevents[i].hour >= 17 && Enterevents[i].hour <= 19) // 17:00 - 19:00 -> Section 5
            {
                Enterevents[i].section = 5; // maybe add prob of 90% instead of 100%
                var newHour = Math.floor(Math.random()*24) + entranceHour;
                if (newHour > 24)
                    newHour = 24;
                Enterevents[i].hour = newHour; // update enter section hour
            }
            else
            {
                Enterevents[i].section = Math.floor(Math.random() * 5) + 1; // 1-5 מקטע
                var newHour = Math.floor(Math.random()*24) + entranceHour;
                if (newHour > 24)
                    newHour = 24;
                Enterevents[i].hour = newHour; // update enter section hour
            }
            console.log("Vehicle " + i + " Leaved Section: " + Enterevents[i].section);
            ioClient.emit("NewEvent",  Enterevents[i]);
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
        }
    }
    //TODO:  add leaving events or enter another section again
    for (let i=0; i < Enterevents.length; i++)
    {
        if (Enterevents[i].action.localeCompare("LeaveSection") == 0) // Choose a leaving section for cars driving in section
        {
            Enterevents[i].action = "LeaveRoad";
            // -== Here we random the actual leaving Section of vehicle ! ==-
            console.log("Vehicle " + i + " Leaved Road at section: " + Enterevents[i].section);
            ioClient.emit("NewEvent",  Enterevents[i]);
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
        }
    }

}