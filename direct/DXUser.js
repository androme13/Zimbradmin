/* 
 * DXUser
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXUser'});
var pool = global.pool;
var DXCommon = require('../tools/DXCommon.js');
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
    add: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'users';
        params[0].log = log;
        var myId = request.session.userinfo.id;
        var query = "INSERT INTO " + params[0].table;
        query += " (level,state,username,firstname,lastname,created_by) VALUES ('";
        query += params[0].level + "','";
        query += params[0].state + "','";
        query += params[0].username.toLowerCase() + "','";
        params[0].firstname.toLowerCase();
        params[0].firstname.charAt(0).toUpperCase();
        query += params[0].firstname + "','";
        params[0].firstname.toUpperCase();
        query += params[0].lastname + "','";
        query += myId + "')";
        //var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM ";
        params[0].query = query;
        console.log (query);
        DXCommon.add(params[0], callback, sessionID, request, response);
    },
    destroy: function (params, callback, sessionID, request, response) {
        // multi requete
        if (!params) {
            var params = [];
            params[0] = {};
        }
        var newParams = {};
        newParams.table = 'users';
        newParams.log = log;
        newParams.length = params.length;
        var occur = '';
        var temp = '';
        var count = 0;
        params.forEach(function (entry) {
            count++;
            // test erreur///
            //if (count == 2)
            // entry.domain = 'aa' + entry.domain;
            temp = "(" + entry.id + ",";
            temp+= entry.level + ",";
            temp+= entry.state + ",'";
            temp+= entry.username + "','";
            temp+= entry.firstname + "','";
            temp+= entry.lastname + "')";
            if (count < params.length)
            {
                temp += ',';
            }
            occur += temp;
        });
        var query = "DELETE FROM " + newParams.table + " WHERE (id,level,state,username,firstname,lastname) IN (" + occur + ")";
        console.log(query);
        newParams.query = query;
        DXCommon.destroy(newParams, callback, sessionID, request, response);
    },
    get: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        params.table = 'users';
        if (!params.col)
            params.col = 'username';
        if (!params.start)
            params.start = 0;
        if (!params.limit)
            params.limit = 50;
        if (params.search) {
            params.extraQuery = "WHERE " + params.col;
            params.extraQuery += " LIKE '%" + params.search + "%'";
        }
        params.log = log;
        var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM "
        query += params.table + " " + extraQuery;
        query += " LIMIT " + params.start + ',' + params.limit;
        params.query = query;
        DXCommon.get(params, callback, sessionID, request, response);
    },
    update: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        var query;
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'transport';
        params[0].log = log;
        query = "UPDATE users SET level ='" + params[0].level;
        query += "', state ='" + params[0].state;
        query += "', username ='" + params[0].username;
        query += "', firstname ='" + params[0].firstname;
        query += "', lastname ='" + params[0].lastname;
        query += "', modified_by='" + myId;
        query += "' WHERE id ='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
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