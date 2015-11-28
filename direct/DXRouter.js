/* 
 * DXRouter
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXRouter'});
var pool = global.pool;
var DXCommon = require('../tools/DXCommon.js');

var DXRouter = {
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
    addRelayDomains: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        if (!params) {
            var params = [];
        }
        var query = '';
        var table = 'relay_domains';
        var myId = request.session.userinfo.id;
        params.every(function (param) {
            query += "INSERT INTO " + table;
            query += " (state,domain,comment,created_by) VALUES (";
            query += param.state + ",'";
            query += param.domain.toLowerCase() + "','";
            query += param.comment + "','";
            query += myId + "')";
            return true;
        });
        DXCommon.add2(query, callback, sessionID, request, response, log);
    },
    addMyNetworks: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        if (!params) {
            var params = [];
            params[0] = {};
        }
        var query = '';
        var table = 'mynetworks';
        var myId = request.session.userinfo.id;
        params.every(function (param) {
            var query = "INSERT INTO " + table;
            query += " (state,network,comment,created_by) VALUES (";
            query += param.state + ",'";
            query += param.network + "','";
            query += param.comment + "','";
            query += myId + "')";
            return true;
        });
        DXCommon.add2(query, callback, sessionID, request, response, log);
    },
    destroyRelayDomains: function (params, callback, sessionID, request, response) {
        // multi requete
        if (!params) {
            var params = [];
        }
        var query='';
        var table = 'relay_domains';
        params.every(function (param) {
            // test erreur///
            //if (count == 2)
            // entry.domain = 'aa' + entry.domain;
            query += "DELETE FROM " + table + " WHERE ";
            query += "id=" + param.id + " AND ";
            query += "state='" + param.state + "' AND ";
            query += "domain='" + param.domain + "' AND ";
            query += "comment='" + param.comment + "'; ";
            return true;
        });
        DXCommon.destroy2(query, callback, sessionID, request, response, log);
    },
    destroyMyNetworks: function (params, callback, sessionID, request, response) {
        // multi requete
        if (!params) {
            var params = [];
        }
        var query='';
        var table = 'mynetworks';
        params.forEach(function (entry) {
            count++;
            // test erreur///
            //if (count == 2)
            // entry.domain = 'aa' + entry.domain;
            query += "DELETE FROM " + table + " WHERE ";
            query += "id="+param.id + " AND ";
            query += "state='"+param.state + "' AND ";
            query += "username='"+param.network + "' AND ";
            query += "lastname='"+param.comment + "';";
            return true;
        });
        DXCommon.destroy2(query, callback, sessionID, request, response, log);
    },
    getRelayDomains: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        if (!params.extraQuery)
            params.extraQuery = '';
        params.table = 'relay_domains';
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
    getMyNetworks: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        if (!params.extraQuery)
            params.extraQuery = '';
        params.table = 'mynetworks';
        if (!params.col)
            params.col = 'network';
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
    updateRelayDomains: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        var query;
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'relay_domains';
        params[0].log = log;
        query = "UPDATE " + params[0].table + " SET state =" + params[0].state;
        query += ", domain ='" + params[0].domain;
        query += "', comment ='" + params[0].comment;
        query += "', modified_by='" + myId;
        query += "' WHERE id ='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
    },
    updateMyNetworks: function (params, callback, sessionID, request, response) {
        // mono requete, à voir plus tard pour du multi-requete
        var query;
        var myId = request.session.userinfo.id;
        // on set les parametres par défaut si ils sont absents
        if (!params) {
            var params = [];
            params[0] = {};
        }
        params[0].table = 'mynetworks';
        params[0].log = log;
        query = "UPDATE " + params[0].table + " SET state =" + params[0].state;
        query += ", network ='" + params[0].network;
        query += "', comment ='" + params[0].comment;
        query += "', modified_by='" + myId;
        query += "' WHERE id ='" + params[0].id + "'";
        params[0].query = query;
        DXCommon.update(params, callback, sessionID, request, response);
    },
};





module.exports = DXRouter;