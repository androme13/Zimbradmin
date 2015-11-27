/* 
 * DXTransport
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXTransport'});
var pool = global.pool;
var DXCommon = require('../tools/DXCommon.js');
var DXTransport = {
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
        // mono requete, à voir plus tard pour du multi-requete
        if (!params) {
            var params = [];
            params[0] = {};
        }
        var query = '';
        var table = 'transport';
        params[0].log = log;
        var myId = request.session.userinfo.id;
        params.every(function (param) {
            query += "INSERT INTO " + table;
            query += " (state, domain, transport, created_by) VALUES (";
            query += param.state + ",'";
            query += param.domain.toLowerCase() + "','";
            query += param.transport.toLowerCase() + "','" + myId + "')";
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
        var query = '';
        var table = 'transport';
        var count = 0;
        params.every(function (param) {
            count++;
            // test erreur///
            //if (count == 2)
            // entry.domain = 'aa' + entry.domain;
            query += "DELETE FROM " + table + " WHERE ";
            query += "id="+param.id + " AND ";
            query += "domain='"+param.domain + "' AND ";
            query += "transport='"+param.transport + "'; ";
            return true;
        });
        DXCommon.destroy2(query, callback, sessionID, request, response, log);
    },
    get: function (params, callback, sessionID, request, response) {
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        if (!params.extraQuery)
            params.extraQuery = '';
        params.table = 'transport';
        if (!params.col)
            params.col = 'domain';
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
        params[0].table = 'transport';
        params[0].log = log;
        var query = "UPDATE " + params[0].table + " SET ";
        query += "state=" + params[0].state;
        query += ", domain='" + params[0].domain.toLowerCase();
        query += "', transport='" + params[0].transport.toLowerCase();
        query += "', modified_by='" + myId;
        query += "' WHERE id='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
    }
};

module.exports = DXTransport;