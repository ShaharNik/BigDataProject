var bigml = require('bigml');

var connection = new bigml.BigML('SHAHARNIK1',
                             'API KEY e02260ed66f3dd2ef0f862bd9c7c27b6cab9d28a'
                             )
                            
    var source = new bigml.Source(connection);
    source.create('./iris.csv', function(error, sourceInfo) {
      if (!error && sourceInfo) {
        var dataset = new bigml.Dataset();
        dataset.create(sourceInfo, function(error, datasetInfo) {
          if (!error && datasetInfo) {
            var model = new bigml.Model();
            model.create(datasetInfo, function (error, modelInfo) {
              if (!error && modelInfo) {
                var prediction = new bigml.Prediction();
                prediction.create(modelInfo, {'petal length': 1})
              }
            });
          }
        });
      }
    });
