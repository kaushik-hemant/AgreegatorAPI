var app = require('express')();
var config = require(__dirname + '/APIConfig.json');
var Promise = require('es6-promise').Promise;
var processPort = config.sensorAppStarterPort;
var fs = require('fs');
var exec = require('child_process').exec,
    child, intervalTime = config.sensorServerInterval;

var alreadyStarted = false,
    alreadyStopped = true;

console.log('sensor app starter running @ ' + processPort + ' on ', new Date())

app.listen(processPort, function () {
    setTimeout(function () {
        processInitiator();
    }, intervalTime);
})

function processInitiator() {
    console.log('function called for execution @ ', new Date())
    var contents = fs.readFileSync(__dirname + config.AgreegatorIdFilePath);
    config = JSON.parse(contents);
    if (!isNUllOrEmpty(config.AgreegatorId) && !isNUllOrEmpty(config.AgreegatorType) &&
        config.AgreegatorType.toUpperCase() == 'D3498E79-8B6B-40F1-B96D-93AA132B2C5B') {
        if (!alreadyStarted)
            startProcessForSensors();
    } else {
        if (!alreadyStopped)
            stopProcessForSensors();
    }
}

function isNUllOrEmpty(value) {
    var isNullOrEmpty = true;
    if (value) {
        if (typeof (value) == 'string') {
            if (value.length > 0)
                isNullOrEmpty = false;
        }
    }
    return isNullOrEmpty;
}

function startProcessForSensors() {
    child = exec('sh ' + __dirname + '/sensorsStart.sh',
        function (error, stdout, stderr) {
            console.log('Current time: ', new Date())
            console.log('sensor app start event: after 5 sec, stdout: ' + stdout)
            console.log('sensor app start event: after 5 sec, stderr: ' + stderr)
            alreadyStarted = true;
            alreadyStopped = false;
            if (error !== null) {
                console.log('Current time: ', new Date())
                console.log('sensor app start event after 5 sec, error: ' + error)
            }
        }
    )
}

function stopProcessForSensors() {
    child = exec('sh ' + __dirname + '/sensorsStop.sh',
        function (error, stdout, stderr) {
            console.log('Current time: ', new Date())
            console.log('sensor app stop event: after 5 sec, stdout: ' + stdout)
            console.log('sensor app stop event: after 5 sec, stderr: ' + stderr)
            alreadyStarted = false;
            alreadyStopped = true;
            if (error !== null) {
                console.log('Current time: ', new Date())
                console.log('sensor app stop event after 5 sec, error: ' + error)
            }
        }
    )
}