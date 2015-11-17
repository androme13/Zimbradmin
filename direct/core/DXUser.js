/* 
 * DXUser
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXUser'});
var pool = global.pool;
var DXCommon = require('../../tools/DXCommon.js');
var fs = require('fs');
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
        }
        var query = '';
        var table = 'users';
        var myId = request.session.userinfo.id;
        params.every(function (param) {
            query += "INSERT INTO " + table;
            query += " (level,state,username,password,firstname,lastname,created_by) VALUES ('";
            query += param.level + "','";
            query += param.state + "','";
            query += param.username.toLowerCase() + "','";
            query += param.password + "','";
            query += param.firstname + "','";
            query += param.lastname.toUpperCase() + "','";
            query += myId + "'); ";
            return true;
        });
        console.log('users', query);
        DXCommon.add2(query, callback, sessionID, request, response, log);
    },
    addUserModules: function (params, callback, sessionID, request, response) {
        // on set les parametres par défaut si ils sont absents
        var id;
        var query = '';
        if (!params)
            var params = {};
        var table = 'usersmodules';
        params.every(function (param) {
            query += "INSERT INTO " + table;
            query += " (userid,moduleid) VALUES (";
            query += param.userid + ",";
            query += param.moduleid + "); ";
            return true;
        });
        DXCommon.add2(query, callback, sessionID, request, response, log);
    },
    destroy: function (params, callback, sessionID, request, response) {
        // multi requete
        var query='';
        if (!params) {
            var params = [];
            params[0] = {};
        }
        table = 'users';      
        params.every(function (param) {
            // test erreur///
            //if (count == 2)
            // entry.domain = 'aa' + entry.domain;
            query += "DELETE FROM " + table + " WHERE ";
            query += "id="+param.id + " AND ";
            query += "level='"+param.level + "' AND ";
            query += "state='"+param.state + "' AND ";
            query += "username='"+param.username + "' AND ";
            query += "firstname='"+param.firstname + "' AND ";
            query += "lastname='"+param.lastname + "'; ";
            return true;
        });
        DXCommon.destroy2(query, callback, sessionID, request, response, log);
    },
    destroyUserModules: function (params, callback, sessionID, request, response) {
        // on set les parametres par défaut si ils sont absents
        var query = '';
        params.table = 'usersmodules';
        params.every(function (param) {
            query += "DELETE FROM " + params.table + " WHERE ";
            query += "userid =" + param.userid + " AND ";
            query += "moduleid =" + param.moduleid + "; ";
            //query += query;
            return true;
        });
        DXCommon.destroy2(query, callback, sessionID, request, response, log);
    },
    destroyAllUserModules: function (params, callback, sessionID, request, response) {
        // on set les parametres par défaut si ils sont absents
        var query = '';
        params.table = 'usersmodules';
        params.every(function (param) {
            query += "DELETE FROM " + params.table + " WHERE ";
            query += "userid =" + param.userid + "; ";
            //query += query;
            return true;
        });
        DXCommon.destroy2(query, callback, sessionID, request, response, log);
    },
    
    get: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        if (!params.extraQuery)
            params.extraQuery = '';
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
        query += params.table + " " + params.extraQuery;
        query += " LIMIT " + params.start + ',' + params.limit;
        params.query = query;
        DXCommon.get(params, callback, sessionID, request, response);
    },
    isExistUserByName: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        params.table = 'users';
        params.col = 'username';
        if (!params.search)
            params.search = "";
        if (params.search) {
            params.extraQuery = "WHERE " + params.col;
            params.extraQuery += " = '" + params.search + "'";
        }
        params.log = log;
        var query = "SELECT " + params.col + " FROM ";
        query += params.table + " " + params.extraQuery;
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
        params[0].table = 'users';
        params[0].log = log;
        query = "UPDATE " + params[0].table + " SET level ='" + params[0].level;
        query += "', state ='" + params[0].state;
        query += "', username ='" + params[0].username.toLowerCase();
        if (params[0].password !== '')
            query += "', password ='" + params[0].password;
        query += "', firstname ='" + params[0].firstname;
        query += "', lastname ='" + params[0].lastname.toUpperCase();
        query += "', modified_by='" + myId;
        query += "' WHERE id ='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
    },
    // operations sur les raccourcis ////////////////////////////////
    getmodules: function (params, callback, sessionID, request, response) {
        // on set les parametres par défaut si ils sont absents
        var id;
        if (!params)
            var params = {};
        params.extraQuery = '';
        params.table = 'users';
        if (!params.id) {
            id = request.session.userinfo.id;
        }
        else
        {
            id = params.id;
        }
        if (!params.start)
            params.start = 0;
        if (!params.limit)
            params.limit = 0;
        params.log = log;
        var query = "SELECT moduleid,module,modules.comment,hasshortcut FROM users ";
        query += "INNER JOIN usersmodules ";
        query += "ON users.id=usersmodules.userid ";
        query += "INNER JOIN modules ";
        query += "ON modules.id=usersmodules.moduleid ";
        query += "WHERE users.id=" + id;
        params.query = query;
        DXCommon.get(params, callback, sessionID, request, response);
    },
    getUserModules: function (params, callback, sessionID, request, response) {
        // on set les parametres par défaut si ils sont absents
        var id;
        if (!params)
            var params = {};
        params.extraQuery = '';
        params.table = 'usersmodules';
        if (!params.id) {
            id = request.session.userinfo.id;
        }
        else
        {
            id = params.id;
        }
        if (!params.start)
            params.start = 0;
        if (!params.limit)
            params.limit = 0;
        params.log = log;
        var query = "SELECT id, userid, moduleid FROM " + params.table;
        query += " WHERE userid=" + id;
        params.query = query;
        DXCommon.get(params, callback, sessionID, request, response);
    },
    // operations sur les wallpapers ////////////////////////////////
    getwallpapers: function (params, callback, sessionID, request, response) {
        response.header('My-Custom-Header ', '1234567890');
        var success;
        var data = [];
        var message = [];
        // on va cherchez les wallpapaer
        fs.readdir('./client/wallpapers', function (err, files) {
            if (!err) {

                files.forEach(function (file) {
                    data.push(new child(file));
                });
                message = {
                    'ZMTypeCode': 'DX',
                    'ZMErrorCode': 300
                };
                success = true;
            } else
            {
                message = {
                    'ZMTypeCode': 'DX',
                    'ZMErrorCode': 302
                };
                success = false;

            }
            DXCommon.sendMsg(success, message, data, callback, data.length);
        });
    }
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