/* 
 * DXMonitor
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXMonitor'});
var DXCommon = require('../../tools/DXCommon.js');


var DXMonitor = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */


    getCPUUsage: function (params, callback, sessionID, request, response) {       
        DXCommon.sendMsg(true,null,global.Monitor.ZM.CPU,callback,2);
       /* callback({
            success: success,
            message: 'getshortcuts',
            data: global.Monitor.ZM.CPU
        });*/
    },
};

function child(img) {
    return {qtip: img, text: getTextOfWallpaper(img), iconCls: '', leaf: true};
};

function getTextOfWallpaper(path) {
    var text = path, slash = path.lastIndexOf('/');
    if (slash >= 0) {
        text = text.substring(slash + 1);
    }
    var dot = text.lastIndexOf('.');
    //text = Ext.String.capitalize(text.substring(0, dot));
    text = text.replace(/[-]/g, ' ');
    return text;
};

module.exports = DXMonitor;