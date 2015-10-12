/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fs = require('fs');
var MySQLConfig = global.MySQLConfig;
var log = global.log.child({widget_type: 'DXUser'});
var pool = mysql.createPool({
    connectionLimit: 100,
    host: MySQLConfig.host,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database: MySQLConfig.database,
    debug: false
});

var DXUser = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */


    // operations sur les user ////////////////////////////////
    addusers: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            console.log(params);
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM users "

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }
                    callback({
                        success: false,
                        message: "addusers",
                        data: data
                    });
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });
        

    },
    
    
    destroyusers: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            console.log(params);
            var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM users "

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }
                    callback({
                        success: false,
                        message: "getuserslist",
                        data: data
                    });
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });
    },
    getusers: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            //if(availPoolCnx==false)return;
            //console.log('connected as id ' + connection.threadId);
            var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM users "
            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }
                    callback({
                        success: success,
                        message: "getuserslist",
                        data: data
                    });
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });
    },
    updateusers: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            console.log(params);
            //log.infos(params);
        })

    },
    // operations sur les raccourcis ////////////////////////////////
    getshortcuts: function (params, callback, sessionID, request, response) {
        
        
        /*pool.getConnection(function (err, connection) {
            console.log ('params:',params);
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            //if(availPoolCnx==false)return;
            //console.log('connected as id ' + connection.threadId);
                        var query = "SELECT * FROM users " +
                    "INNER JOIN usersshortcut " +
                    "ON modules.id=usersshortcuts.userid " +
                    "INNER JOIN modules " +
                    "ON modules.id=usersmodules.moduleid " +
                    "WHERE users.id=" + params.id;
            
            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }
                    callback({
                        success: success,
                        message: "getshortcuts",
                        data: data
                    });
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });*/
        
        
        
        response.header('My-Custom-Header ', '1234567890');
        var data = new Object();
        var success = true;

        data = [{name: 'Grid Window', module: 'grid-win'},
            {name: 'param', module: 'zmsettings-win'},
            {name: 'Notepad', module: 'notepad'},
            {name: 'System Status', module: 'systemstatus-win'}];
        callback({
            success: success,
            message: 'getshortcuts',
            data: data
        });
    },
    getmodules: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            //console.log('connected as id ' + connection.threadId);
            var query = "SELECT moduleid,module,hasshortcut FROM users " +
                    "INNER JOIN usersmodules " +
                    "ON users.id=usersmodules.userid " +
                    "INNER JOIN modules " +
                    "ON modules.id=usersmodules.moduleid " +
                    "WHERE users.id=" + params.id;

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }

                    callback({
                        success: success,
                        message: "getmodules",
                        data: data
                    });
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });
    },
    // operations sur les wallpapers ////////////////////////////////
    getwallpapers: function (params, callback, sessionID, request, response) {
        response.header('My-Custom-Header ', '1234567890');
        var data = [];
        var success = false;
        // on va cherchez les wallpapaer
        fs.readdir('./client/wallpapers', function (err, files) {
            if (!err) {
                success = true;
                files.forEach(function (file) {
                    data.push(new child(file));
                });
            }
            callback({
                success: success,
                //message: 'getwallpapers',
                data: data
            });

        });

    },
};



// fonctions sur les wallpapaers ////////////////////////////////

function availPoolCnx() {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            //res.json({"code": 100, "status": "Error in connection database"});
            log.warn("Error connecting database ... \n\n");
            return false;
        }
        else
        {
            return true;
        }
    });
}

function child(img) {
    return {qtip: img, text: getTextOfWallpaper(img), iconCls: '', leaf: true};
}
;

function getTextOfWallpaper(path) {
    var text = path, slash = path.lastIndexOf('/');
    if (slash >= 0) {
        text = text.substring(slash + 1);
    }
    var dot = text.lastIndexOf('.');
    //text = Ext.String.capitalize(text.substring(0, dot));
    text = text.replace(/[-]/g, ' ');
    return text;
}
;

module.exports = DXUser;