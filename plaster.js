exports.plaster = function()
{
    console,log("Plaster was needed and activated");
    if (obj.type == "Truck") {
        obj.prediction = 2;
      }
      else if (obj.type == "Private") {
        obj.prediction = 5;
      }
      else {
        obj.prediction = Math.floor(Math.random() * 5) + 1
      }
}