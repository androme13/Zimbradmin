/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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


    getshortcuts: function (params, callback, sessionID, request, response) {
        response.header('My-Custom-Header ', '1234567890');
        var data = new Object();
        var success = true;

        data = [{name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win'},
            {name: 'Accordion Window', iconCls: 'accordion-shortcut', module: 'acc-win'},
            {name: 'Notepad', iconCls: 'notepad-shortcut', module: 'notepad'},
            {name: 'System Status', iconCls: 'cpu-shortcut', module: 'systemstatus'}];

        callback({
            success: success,
            message: 'getshortcuts',
            data: data
        });
    },
    getwallpapers: function (params, callback, sessionID, request, response) {
        response.header('My-Custom-Header ', '1234567890');
        var data = new Object();
        var success = true;
        data = [child('Wood-Sencha.jpg'),
                        child('blue.jpg'),
                        child('desk.jpg'),
                        child('desktop.jpg'),
                        child('desktop2.jpg'),
                        child('sky.jpg')],

        callback({
            success: success,
            message: 'getwallpapers',
            data: data
        });


    }
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