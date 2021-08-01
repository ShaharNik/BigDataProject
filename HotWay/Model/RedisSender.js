// var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var redis = require('redis');
var redisClient = redis.createClient();
// io = require("socket.io-client");
// ioClient = io.connect("http://localhost:6062");
// async = require('async');

function CarEnterSection(carNumber, section) {
    var section = 'section' + JSON.stringify(section);
    // redisClient.sadd(section, carNumber);
    redisClient.sadd(section, carNumber, function (err, reply) {
        // console.log(reply);
    });
}
function CarLeaveSection(carNumber) {
    var section = ''
    for (let i = 1; i <= 5; i++) {
        section = 'section' + JSON.stringify(i);
        redisClient.srem(section, carNumber);
    }
}

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });


redisClient.on('connect', function () {
    console.log('Sender connected to Redis');
});
// server.listen(6062, function () {
//     console.log('Sender is running on port 6062');
// });

module.exports = { CarEnterSection, CarLeaveSection };