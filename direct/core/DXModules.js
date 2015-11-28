/* 
 * DXModules
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXModules'});
var pool = global.pool;
var DXCommon = require('../../tools/DXCommon.js');

var DXModules = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */
    add: function (params, callback, sessionID, request, response) {
        if (!params) {
            var params = [];
        }
        var query = '';
        var table = 'modules';
        var myId = request.session.userinfo.id;
        params.every(function (param) {
            query += "INSERT INTO " + table;
            query += " (level,state,module,comment,created_by) VALUES (";
            query += param.level + ",";
            query += param.state + ",'";
            query += param.module + "','";
            query += param.comment + "','";
            query += myId + "'); ";
            return true;
        });
        DXCommon.add2(query, callback, sessionID, request, response, log);
    },
    destroy: function (params, callback, sessionID, request, response) {
        // multi requete
        if (!params) {
            var params = [];
            params[0] = {};
        }
        var newParams = {};
        newParams.table = 'modules';
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
            temp = "(" + entry.id + ",'";
            temp += entry.domain + "','";
            temp += entry.transport + "')";
            if (count < params.length)
            {
                temp += ',';
            }
            occur += temp;
        });
        var query = "DELETE FROM " + newParams.table + " WHERE (id,module,comment) IN (" + occur + ")";
        newParams.query = query;
        DXCommon.destroy(newParams, callback, sessionID, request, response);
    },
    get: function (params, callback, sessionID, request, response) {
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        if (!params.extraQuery)
            params.extraQuery = '';
        params.table = 'modules';
        if (!params.col)
            params.col = 'module';
        if (!params.start)
            params.start = 0;
        if (!params.limit)
            params.limit = 50;
        if (params.search) {
            params.extraQuery = " WHERE " + params.col;
            params.extraQuery += " LIKE '%" + params.search + "%'";
        }
        params.log = log;
        var query = "SELECT * FROM " + params.table + params.extraQuery;
        query += " LIMIT " + params.start + ',' + params.limit;
        params.query = query;
        DXCommon.get(params, callback, sessionID, request, response);
    },
    update: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'modules';
        params[0].log = log;
        var query = "UPDATE " + params[0].table + " SET module='" + params[0].module;
        query += "', state ='" + params[0].state;
        query += "', comment='" + params[0].comment;
        query += "', modified_by='" + myId;
        query += "' WHERE id='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
    },
    addmodulesshortcut: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        params.table = 'usersmodules';
        params.log = log;
        var query = "UPDATE usersmodules " +
                "INNER JOIN users " +
                "ON users.id=usersmodules.userid " +
                "INNER JOIN modules " +
                "ON (modules.id=usersmodules.moduleid AND modules.module='" + params.module + "') " +
                "SET usersmodules.hasshortcut=1 " +
                "WHERE usersmodules.userid=" + myId;
        params.query = query;
        DXCommon.update([params], callback, sessionID, request, response);
    },
    removemodulesshortcut: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params) {
            var params = [];
        }
        params.table = 'usersmodules';
        params.log = log;
        var query = "UPDATE usersmodules " +
                "INNER JOIN users " +
                "ON users.id=usersmodules.userid " +
                "INNER JOIN modules " +
                "ON (modules.id=usersmodules.moduleid AND modules.module='" + params.module + "') " +
                "SET usersmodules.hasshortcut=0 " +
                "WHERE usersmodules.userid=" + myId;
        params.query = query;
        DXCommon.update([params], callback, sessionID, request, response);
    }
};
module.exports = DXModules;