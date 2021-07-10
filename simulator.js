io = require("socket.io-client");
ioClient = io.connect("http://localhost:3000");


module.exports.GenerateData= async function () 
{
    //await new Promise(resolve => setTimeout(resolve, 5000));
    var type = ['Private', 'Truck', 'Commercial']; // private , מסחרי, משאית 
    var action = ['EnterRoad', 'LeaveRoad', 'EnterSection', 'LeaveSection']; //כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע   
    var actionEnter = ['EnterRoad', 'EnterSection']; //כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע 
    var actionLeave = ['LeaveRoad', 'LeaveSection']; //כניסה לכביש, יציאה מהכביש, כניסה למקטע, יציאה ממקטע 
    var SectionsCounters = [0, 0, 0, 0, 0]; // count how many vehicles on each section
    var VehiclesOnRoadCounter = 0;
    const Enterevents = [];
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
    for (let i = 1; i <= 10; i++)
    {
        var event= {};
        //event.id = Math.floor(Math.random() * 10) + 1;
        event.action = actionEnter[Math.floor(Math.random() * actionEnter.length)]; // Car can't leave if not entered...!!!
        VehiclesOnRoadCounter++;
        if (event.action.localeCompare('EnterSection') == 0)// event.action is 'EnterSection'
        {
            event.section = Math.floor(Math.random() * 6) + 1; // 1-5 מקטע
            SectionsCounters[event.section]++; // a new vehicle on section
        }
        
        event.type = type[Math.floor(Math.random() * type.length)]; 
        event.day = Math.floor(Math.random() * 8) + 1; // 1-7
        event.hour = Math.round(Math.random()*24) + 1;
        event.isSpecial = Math.random() < 0.2; //20% probability of getting true;
        //console.log(JSON.stringify(event));
        //console.log("--------");
        //console.log(event);
        Enterevents.push(event);
        //kafka.publish(event)

        console.log(i + " enter msg created");
        ioClient.emit("callDetails",  event); // פה נשלח מידע לאיוונט בשם של הסוקט, הטיפול בו נמצא באפ והוא מדפיס את המידע לקונסול ושולח אותו לקאפקה
        //await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
    }
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
    console.log(VehiclesOnRoadCounter);
    //  -=== Leave events ===- 
    var i = 0;
    while (VehiclesOnRoadCounter > 0) 
    {
        var event= {};
        //event.id = Math.floor(Math.random() * 10) + 1;
        event.action = actionLeave[Math.floor(Math.random() * actionLeave.length)]; 
        // Car can't leave if not entered...!!!
        if (event.action.localeCompare('LeaveRoad') == 0)
        {
            VehiclesOnRoadCounter--;
            console.log("--- Leave road Event ---")
        }
        else // event.action is 'LeaveSection'
        {
            event.section = Math.floor(Math.random() * 6) + 1; // 1-5 מקטע
            if (SectionsCounters[event.section] > 0) // there is veichels on road and viechle on section
            {
                SectionsCounters[event.section]--; 
                VehiclesOnRoadCounter--;
                // if we leave section we can: enter to another section or leave road !

                //enter another section... NEED TO ADD
                //TODO: Need to add the option to enter another section after leaving 1
                
                console.log("--- Leave section Event ---")
            }
            else // if there is no vehicle on that section
            {
                console.log("Continue");
                continue; // random again
            }
        }
        //TODO: Need to add the option to enter another section after leaving 1
      //  if (SectionsCounters.reduce((a, b) => a + b, 0) > 0)
       // {
            event.type = type[Math.floor(Math.random() * type.length)]; 
            event.day = Math.floor(Math.random() * 8) + 1; // 1-7
            event.hour = Math.round(Math.random()*24) + 1;
            event.isSpecial = Math.random() < 0.2; //20% probability of getting true;

            console.log(++i + " leave msg created");
            ioClient.emit("callDetails",  event); // פה נשלח מידע לאיוונט בשם של הסוקט, הטיפול בו נמצא באפ והוא מדפיס את המידע לקונסול ושולח אותו לקאפקה
            //await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5000) + 2000));
      //  }
    }
}