/* 
 * DXSmtp
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXUser'});
var pool = global.pool;
var DXCommon = require('../tools/DXCommon.js');

var DXSmtp = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */


    // operations sur les serveur smtp ////////////////////////////////
    add: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'smtp_servers';
        params[0].log = log;
        var myId = request.session.userinfo.id;
        var query = "INSERT INTO " + params[0].table;
        query += " (state,server,comment,created_by) VALUES ('";
        query += params[0].state + "','";
        query += params[0].server.toLowerCase() + "','";
        query += params[0].comment.toLowerCase() + "','";
        query += myId + "')";
        //var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM ";
        params[0].query = query;
        DXCommon.add(params[0], callback, sessionID, request, response);
    },
    destroy: function (params, callback, sessionID, request, response) {
        // multi requete
        if (!params) {
            var params = [];
            params[0] = {};
        }
        var newParams = {};
        newParams.table = 'smtp_servers';
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
            temp += entry.state + ",'";
            temp += entry.server + "','";
            temp += entry.comment + "')";
            if (count < params.length)
            {
                temp += ',';
            }
            occur += temp;
        });
        var query = "DELETE FROM " + newParams.table + " WHERE (id,state,server,comment) IN (" + occur + ")";
        newParams.query = query;
        DXCommon.destroy(newParams, callback, sessionID, request, response);
    },
    get: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        if (!params.extraQuery)
            params.extraQuery = '';
        params.table = 'smtp_servers';
        if (!params.col)
            params.col = 'server';
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
        var query;
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'smtp_servers';
        params[0].log = log;
        query = "UPDATE " + params[0].table + " SET state ='" + params[0].state;
        query += "', server ='" + params[0].server;
        query += "', comment ='" + params[0].comment;
        query += "', modified_by='" + myId;
        query += "' WHERE id ='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
    },
};





module.exports = DXSmtp;