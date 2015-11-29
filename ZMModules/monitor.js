/* 
 * monitor.js
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXMonitor'});
//global.Monitor.ZM = {};
var exec = require('child_process').exec;

var fs = require('fs');
var os = require('os');
var cpu = os.cpus();
var Monitor = new Object();
var memTotal = 0;
var memFree = 0;
var memBuffers = 0;
var memCached = 0;
//var counter = 0;
var total = 0;
var sys = 0;
var user = 0;
var nice = 0;
var irq = 0;
var idle = 0;
function start(MonitorConfig) {
    var me = this;
    var stat1, stat2, info1, info2;
    //on definit le monitor zm
    global.Monitor.ZM = {};
    Monitor.tasks.ZM = setInterval(function () {
        //clearInterval(this);
        // on s'occupe de la mémoire
        stat1 = fs.readFileSync('/proc/meminfo', "utf8");
        var memDataRaw = stat1.split('\n');       
        var memData ={};
        var tempData = [];
        for (var i=0;i<memDataRaw.length-1;i++){
            tempData=memDataRaw[i].split(':');
            tempData[1]= parseInt(tempData[1]);
            memData[tempData[0]]=tempData[1];
        }
        global.Monitor.ZM.MEM=memData;
        //console.log(global.Monitor.ZM.MEM);
        // on s'occupe du CPU
        stat1 = fs.readFileSync('/proc/stat', "utf8");
        data1 = stat1.split('\n');
        data1[0] = data1[0].replace('cpu  ', '');
        data1f = data1[0].split(' ');
        // on relis les ressources cpu pour faire un dif et avoir la vraie valeur
        setTimeout(function () {
            stat2 = fs.readFileSync('/proc/stat', "utf8");
            data2 = stat2.split('\n');
            data2[0] = data2[0].replace('cpu  ', '');
            data2f = data2[0].split(' ');
            user = data2f[0] - data1f[0];
            nice = data2f[1] - data1f[1];
            sys = data2f[2] - data1f[2];
            idle = data2f[3] - data1f[3];
            total = user + nice + sys + idle;
            global.Monitor.ZM.CPU = {
                'idle': idle / total * 100,
                'sys': sys / total * 100,
                'user': user / total * 100,
                'nice': nice / total * 100
            };
        },
                1000);
    }, MonitorConfig.timerZM);

// on definit le monitor postfix
    Monitor.tasks.SMTP = setInterval(function () {
    }, MonitorConfig.timerSMTP);
}
;
function topToString(entry, start, stop) {
    entry.replace(' ', '');
    return entry.substring(start, stop).replace(',', '.')
}
;

exports.init = function (MonitorConfig) {
    Monitor.tasks = new Object();
    Monitor.ZM = new Object();
    start(MonitorConfig);
};


exports.stop = function () {
    clearInterval(Monitor.tasks.ZM);
    clearInterval(Monitor.tasks.SMTP);
};

