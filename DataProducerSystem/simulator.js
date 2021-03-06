// io = require("socket.io-client");
// ioClient = io.connect("http://localhost:3000"); // why need this?!


module.exports.GenerateData= async function (publish2Kafka) 
{
    const minWait = 300;
    const maxWait = 500;
    const MaxEvents = 2;

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
        event.section = Math.floor(Math.random() * 5) + 1; // 1-5 מקטע;
        event.prediction = 0;
        VehiclesOnRoadCounter++;
        event.type = type[Math.floor(Math.random() * type.length)]; 
        event.day = Math.floor(Math.random() * 8) + 1; // 1-7
        event.hour = Math.floor(Math.random()*24) + 1;
        event.isSpecial = Math.random() < 0.2; //20% probability of getting true;

        event.outSection = 0;
        if (event.type == "Truck") {
            event.outSection = 2;
        }
        else if (event.type == "Private") {
            event.outSection = 5;
        }
        else {
            event.outSection = Math.floor(Math.random() * 5) + 1
        }

        Enterevents.push(event);

        console.log(i + " vehicle of type:  " + event.type + " entered to road");
        //ioClient.emit("NewEvent",  event); // פה נשלח מידע לאיוונט בשם של הסוקט, הטיפול בו נמצא באפ והוא מדפיס את המידע לקונסול ושולח אותו לקאפקה
        publish2Kafka(event);
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait+2000));
    }
    console.log(VehiclesOnRoadCounter + " Vehicles on road");
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));

    // --== Leave road without enter to section ===---
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


    // --== Enter Cars To Sections ==---
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
            //ioClient.emit("NewEvent",  Enterevents[i]);
            publish2Kafka(Enterevents[i]);
            console.log("Vehicle " + i + " Entered Section: " + Enterevents[i].section);
            Enterevents[i].hour = entranceHour; // want to predict with this
        }
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
    }
    // All the vehicles leaved the road or entered a section
    // When vehicle enter to road, we need to predict the section he will leave.
    // We need to choose on which section a vehicle will leave, and give some pattern that we will predict.

    // // - Every Car enter between hour 6-8 have 90% chance to leave at section 2
    // // - Every Car enter between hour 16-18 have 90% chance to leave at section 5

    // // --== Leave Cars From Sections ==---
    // for (let i=0; i < Enterevents.length; i++)
    // {
    //     if (Enterevents[i].action.localeCompare("EnterSection") == 0) // Choose a leaving section for cars driving in section
    //     {
    //         Enterevents[i].action = "LeaveSection";
    //         // -== Here we random the actual leaving Section of vehicle ! ==-
    //         if (Enterevents[i].hour >= 8 && Enterevents[i].hour <= 11) // 08:00 - 11:00 -> Section 2
    //         {
    //             Enterevents[i].section = 2; // maybe add prob of 90% instead of 100%
    //             var newHour = Math.floor(Math.random()*24) + entranceHour;
    //             if (newHour > 24)
    //                 newHour = 24;
    //             Enterevents[i].hour = newHour; // update enter section hour

    //         }
    //         else if (Enterevents[i].hour >= 17 && Enterevents[i].hour <= 19) // 17:00 - 19:00 -> Section 5
    //         {
    //             Enterevents[i].section = 5; // maybe add prob of 90% instead of 100%
    //             var newHour = Math.floor(Math.random()*24) + entranceHour;
    //             if (newHour > 24)
    //                 newHour = 24;
    //             Enterevents[i].hour = newHour; // update enter section hour
    //         }
    //         else
    //         {
    //             Enterevents[i].section = Math.floor(Math.random() * 5) + 1; // 1-5 מקטע
    //             var newHour = Math.floor(Math.random()*24) + entranceHour;
    //             if (newHour > 24)
    //                 newHour = 24;
    //             Enterevents[i].hour = newHour; // update enter section hour
    //         }
    //         console.log("Vehicle " + i + " Leaved Section: " + Enterevents[i].section);
    //         ioClient.emit("NewEvent",  Enterevents[i]);
    //         await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
    //     }
    // }
    // Every Car of type Trunk leave at section 2
    // Every Car of type Private leave at at section 5

    // --== Leave Cars From Sections ==---
    for (let i=0; i < Enterevents.length; i++)
    {
        if (Enterevents[i].action.localeCompare("EnterSection") == 0) // Choose a leaving section for cars driving in section
        {
            Enterevents[i].action = "LeaveSection";
            if (Enterevents[i].type == "Truck") // Trunk -> Section 2
            {
                Enterevents[i].section = 2; // maybe add prob of 90% instead of 100%
                var newHour = Math.floor(Math.random()*24) + entranceHour;
                if (newHour > 24)
                    newHour = 24;
                Enterevents[i].hour = newHour; // update enter section hour

            }
            else if (Enterevents[i].type == "Private") // Private -> Section 5
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
            //ioClient.emit("NewEvent",  Enterevents[i]);
            publish2Kafka(Enterevents[i]);
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
        }
    }
    //TODO: add events for enter another section again maybe?
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait + 5200) + minWait + 3000));
    // --== Leave Cars From Road ==---
    for (let i=0; i < Enterevents.length; i++)
    {
        if (Enterevents[i].action.localeCompare("LeaveSection") == 0) 
        {
            Enterevents[i].action = "LeaveRoad";
            console.log("Vehicle " + i +" type: "+ Enterevents[i].type + " Leaved Road at section: " + Enterevents[i].section); // now the leaving section is the entered section
            //ioClient.emit("NewEvent",  Enterevents[i]);
            publish2Kafka(Enterevents[i]);
            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * maxWait) + minWait));
        }
    }

}