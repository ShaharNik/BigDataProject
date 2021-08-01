var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var redis = require('redis');
var redisClient = redis.createClient();
io = require("socket.io");
ioServer = io(65530);

const { promisify } = require("util");

ioServer.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("getCarsList", (sec) => {
        console.log(sec);
        GetCarList(sec);
    });

});

function GetSectionsCarNumbers(section) {
    let result = 0;
    const sectionTitle = 'section' + JSON.stringify(section);


    const runApplication = async () => {
        const client = redis.createClient();
        const scardAsync = promisify(client.scard).bind(client);
        const carsNum = await scardAsync(sectionTitle);
        ioServer.emit("updateSections", { section: sectionTitle, carsNum: carsNum });
    };

    runApplication();
}

function GetCarList(section) {
    redisClient.smembers(section, function (err, reply) {
        ioServer.emit("carList", reply);
    });
}

redisClient.on('connect', function () {
    console.log('Reciver connected to Redis');
});

module.exports = { GetSectionsCarNumbers };