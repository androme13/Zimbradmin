/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var os = require('os');
var Monitor = new Object();

function start (MonitorConfig) {
    //on definit le monitor zm
    Monitor.tasks.ZM = setInterval(function () {
        Monitor.ZM.CPU = os.cpus();
        Monitor.ZM.MEM = os.freemem();
    },MonitorConfig.timerZM);

// on definit le monitor postfix
    Monitor.tasks.SMTP = setInterval(function () {
        //console.log(Monitor.ZM.CPU);
   },MonitorConfig.timerSMTP);
};





exports.init = function (MonitorConfig) {
    Monitor.tasks = new Object();
    Monitor.ZM = new Object();
    //Monitor.ZM.CPU = new Object();
    
    start(MonitorConfig);

};


exports.stop = function () {
    clearInterval(Monitor.tasks.ZM);
    clearInterval(Monitor.tasks.SMTP);
};