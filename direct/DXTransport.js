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
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'transport';
        params[0].log = log;
        var myId = request.session.userinfo.id;
        query = "INSERT INTO " + params[0].table + " (domain, transport, created_by) VALUES ('" + params[0].domain.toLowerCase() + "','" + params[0].transport.toLowerCase() + "','" + myId + "')";
        params[0].query = query;
        DXCommon.add(params[0], callback, sessionID, request, response);
    },
    destroy: function (params, callback, sessionID, request, response) {
        if (!params) {
            var params = [];
            params[0] = {};
        }
        var newParams = {};
        newParams.table = 'transport';
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
            temp = "(" + entry.id + ",'" + entry.domain + "','" + entry.transport + "')";
            if (count < params.length)
            {
                temp += ',';
            }
            occur += temp;
        });
        query = "DELETE FROM " + newParams.table + " WHERE (id,domain,transport) IN (" + occur + ")";
        newParams.query = query;
        DXCommon.destroy(newParams, callback, sessionID, request, response);
    },
    get: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
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
        query = "SELECT * FROM " + params.table + params.extraQuery;
        query += " LIMIT " + params.start + ',' + params.limit;
        console.log(query);
        params.query = query;
        DXCommon.get(params, callback, sessionID, request, response);
    },
    update: function (params, callback, sessionID, request, response) {
        var query;
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'transport';
        params[0].log = log;
        query = "UPDATE " + params[0].table + " SET domain='" + params[0].domain.toLowerCase();
        query += "', transport='" + params[0].transport.toLowerCase();
        query += "', modified_by='" + myId;
        query += "' WHERE id='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
    },
};

module.exports = DXTransport;